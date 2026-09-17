"""Recover an own-account Slicer token on Windows without creating a dump.

Run through recover_slicer_token.ps1. Only cloud-validated tokens are copied.
"""

import argparse
import ast
import base64
import ctypes
import hashlib
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import uuid
from ctypes import wintypes
from datetime import datetime, timezone
from pathlib import Path

JWT_PATTERN = re.compile(rb"eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+")


class RecoveryError(Exception):
    """An error whose message contains no credentials."""


class MemoryBasicInformation(ctypes.Structure):
    _fields_ = [
        ("base", ctypes.c_void_p), ("allocation", ctypes.c_void_p),
        ("allocation_protect", wintypes.DWORD), ("partition", wintypes.WORD),
        ("size", ctypes.c_size_t), ("state", wintypes.DWORD),
        ("protect", wintypes.DWORD), ("kind", wintypes.DWORD),
    ]


def scan_process(process_id):
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
    kernel.OpenProcess.restype = wintypes.HANDLE
    kernel.VirtualQueryEx.argtypes = [wintypes.HANDLE, ctypes.c_void_p,
                                     ctypes.POINTER(MemoryBasicInformation), ctypes.c_size_t]
    kernel.VirtualQueryEx.restype = ctypes.c_size_t
    kernel.ReadProcessMemory.argtypes = [wintypes.HANDLE, ctypes.c_void_p, ctypes.c_void_p,
                                        ctypes.c_size_t, ctypes.POINTER(ctypes.c_size_t)]
    kernel.CloseHandle.argtypes = [wintypes.HANDLE]
    kernel.QueryFullProcessImageNameW.argtypes = [wintypes.HANDLE, wintypes.DWORD,
                                                wintypes.LPWSTR, ctypes.POINTER(wintypes.DWORD)]
    handle = kernel.OpenProcess(0x410, False, process_id)
    if not handle:
        raise RecoveryError("Cannot read Slicer. Run Slicer and this tool as the same Windows user without elevation.")
    tokens = set()
    address = 0
    deadline = time.monotonic() + 120
    try:
        image_path = ctypes.create_unicode_buffer(32768)
        image_length = wintypes.DWORD(len(image_path))
        if (not kernel.QueryFullProcessImageNameW(handle, 0, image_path, ctypes.byref(image_length))
                or Path(image_path.value).name.lower() != "anycubicslicernext.exe"):
            raise RecoveryError("The selected process is not Anycubic Slicer Next. No memory was scanned.")
        while address < 0x7FFFFFFFFFFF:
            info = MemoryBasicInformation()
            if not kernel.VirtualQueryEx(handle, address, ctypes.byref(info), ctypes.sizeof(info)):
                break
            end = (info.base or 0) + info.size
            if end <= address:
                break
            # Only committed, readable, non-guard pages; never write to the process.
            if info.state == 0x1000 and not info.protect & 0x100 and info.protect & 0xEE:
                pos = info.base or address
                tail = b""
                while pos < end:
                    if time.monotonic() > deadline:
                        raise RecoveryError("Memory scan timed out. Restart Slicer, log in and retry.")
                    length = min(1024 * 1024, end - pos)
                    buffer = ctypes.create_string_buffer(length)
                    read = ctypes.c_size_t()
                    kernel.ReadProcessMemory(handle, pos, buffer, length, ctypes.byref(read))
                    data = tail + buffer.raw[:read.value]
                    # ASCII and UTF-16 storage, including candidates crossing chunk boundaries.
                    for candidate in (data, data.replace(b"\x00", b"")):
                        tokens.update(JWT_PATTERN.findall(candidate))
                    tail = data[-16384:] if read.value else b""
                    pos += length
            address = end
    finally:
        kernel.CloseHandle(handle)
    return tokens


def access_candidates(tokens, now):
    grouped = {}
    accounts = set()
    for token in tokens:
        try:
            part = token.split(b".")[1]
            claims = json.loads(base64.urlsafe_b64decode(part + b"=" * (-len(part) % 4)))
            if not isinstance(claims, dict):
                continue
            expiry = claims.get("exp")
            issued = claims.get("iat", 0)
            if not isinstance(expiry, (int, float)) or not isinstance(issued, (int, float)):
                continue
            if (claims.get("tokenType") != "access-token"
                    or claims.get("iss") != "https://uc.makeronline.com"
                    or expiry <= now or claims.get("nbf", 0) > now):
                continue
            subject = claims.get("sub")
            if not isinstance(subject, str) or not subject:
                continue
            accounts.add(subject)
            key = b".".join(token.split(b".")[:2])
            item = (issued, expiry, token.decode("ascii"))
            # Adjacent memory may extend the signature with valid base64 characters.
            # Prefer the shortest observed copy of each payload, then verify online.
            if key not in grouped or len(token) < len(grouped[key][2]):
                grouped[key] = item
        except (ValueError, TypeError, IndexError, UnicodeError):
            continue
    if len(accounts) > 1:
        raise RecoveryError("Multiple accounts found. Close all Slicer instances, reopen with the intended account and retry.")
    return sorted(grouped.values(), reverse=True)


def load_constants():
    root = Path(__file__).resolve().parents[1]
    source = root / "custom_components/anycubic_ha_integration/anycubic_cloud_api/const/const.py"
    tree = ast.parse(source.read_text(encoding="utf-8"))
    constants = {}
    for node in tree.body:
        if isinstance(node, ast.Assign) and isinstance(node.value, ast.Constant):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    constants[target.id] = node.value.value
    return constants


class NoRedirects(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise RecoveryError("Unexpected cloud redirect. No token was copied.")


def validate_token(token, constants):
    nonce = str(uuid.uuid1())
    timestamp = str(int(time.time() * 1000))
    appid = constants["AC_KNOWN_AID"]
    version = constants["AC_KNOWN_VID_SLICER_NEXT"]
    signature = hashlib.md5((appid + timestamp + version + constants["AC_KNOWN_SEC"] + nonce + appid).encode()).hexdigest()
    headers = {"Xx-Device-Type": "pcf", "Xx-Is-Cn": "1", "Xx-Nonce": nonce,
               "Xx-Signature": signature, "Xx-Timestamp": timestamp,
               "Xx-Version": version, "Content-Type": "application/json", "XX-LANGUAGE": "US"}
    url = "https://cloud-universe.anycubic.com/p/p/workbench/api/v3/public/loginWithAccessToken"
    request = urllib.request.Request(url, data=json.dumps({"device_type": "pcf", "access_token": token}).encode(), headers=headers)
    try:
        with urllib.request.build_opener(NoRedirects()).open(request, timeout=20) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        raise RecoveryError("Cloud returned HTTP %s. Retry later." % error.code) from None
    except (urllib.error.URLError, TimeoutError, ValueError):
        raise RecoveryError("Cloud check unavailable. Check connection and retry; no token was copied.") from None
    if not isinstance(result, dict):
        return False
    data = result.get("data")
    return result.get("code") == 1 and isinstance(data, dict) and isinstance(data.get("token"), str) and bool(data["token"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--process-id", required=True, type=int)
    args = parser.parse_args()
    if sys.platform != "win32" or ctypes.sizeof(ctypes.c_void_p) != 8:
        raise RecoveryError("This tool requires Windows and 64-bit Python 3.9 or newer.")
    print("Reading Slicer memory locally. No dump file will be created.")
    candidates = access_candidates(scan_process(args.process_id), time.time())
    if not candidates:
        raise RecoveryError("No unexpired access token found. Log into Slicer, open the printer view and retry. This Slicer version may be unsupported.")
    constants = load_constants()
    for _, expiry, token in candidates[:5]:
        if validate_token(token, constants):
            subprocess.run(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command",
                            "$ErrorActionPreference='Stop'; $t=[Console]::In.ReadToEnd(); Set-Clipboard -Value $t"],
                           input=token, text=True, check=True, capture_output=True)
            print("Cloud login successful. Access token copied to clipboard; paste into Home Assistant's Slicer Next token field.")
            print("Expires (UTC):", datetime.fromtimestamp(expiry, timezone.utc).isoformat())
            print("MQTT has not been tested. Clear the clipboard after pasting; do not share tokens.")
            return
    raise RecoveryError("Cloud rejected the extracted candidates. Log into Slicer again and retry. No token was copied.")


if __name__ == "__main__":
    try:
        main()
    except RecoveryError as error:
        print("Recovery stopped:", error, file=sys.stderr)
        sys.exit(1)
    except Exception as error:
        # Raw exceptions, response bodies and tracebacks may contain credentials.
        print("Recovery stopped (%s). No credentials will be displayed." % type(error).__name__, file=sys.stderr)
        sys.exit(1)
