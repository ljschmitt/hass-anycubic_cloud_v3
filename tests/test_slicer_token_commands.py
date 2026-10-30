"""Execute the documented commands using synthetic logs and clipboard adapters."""
from __future__ import annotations

import ast
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components/anycubic_ha_integration"
TOKEN_OLD = "eyJvbGQ.payload.signature"
TOKEN_NEW = "eyJbmV3.payload.signature"
BASH = shutil.which("bash")
POWERSHELL = shutil.which("pwsh") or shutil.which("powershell")
if os.name == "nt":
    if not BASH and Path("C:/Program Files/Git/bin/bash.exe").exists():
        BASH = "C:/Program Files/Git/bin/bash.exe"
    if not POWERSHELL:
        candidate = Path(os.environ.get("SystemRoot", "C:/Windows")) / "System32/WindowsPowerShell/v1.0/powershell.exe"
        if candidate.exists():
            POWERSHELL = str(candidate)


def code_block(text, language):
    match = re.search(r"```" + language + r"\n(.*?)\n\s*```", text, re.S)
    if not match:
        raise AssertionError("Missing documented command")
    return textwrap.dedent(match.group(1))


def command_surfaces():
    surfaces = {name: (ROOT / name).read_text(encoding="utf-8") for name in ("README.md", "README.en.md")}
    for name in ("strings.json", "translations/en.json", "translations/de.json"):
        data = json.loads((INTEGRATION / name).read_text(encoding="utf-8"))
        surfaces[name] = data["config"]["step"]["auth_mode_slicer"]["description"]
    return surfaces


def shell_path(path):
    value = path.as_posix()
    if os.name == "nt":
        return "/" + value[0].lower() + value[2:]
    return value


class TokenCommandTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.mac_logs = self.root / "Library/Application Support/AnycubicSlicerNext/log"
        self.win_logs = self.root / "AppData/AnycubicSlicerNext/log"
        for path in (self.mac_logs, self.win_logs):
            path.mkdir(parents=True)
        self.clipboard = self.root / "clipboard.txt"
        self.clipboard.write_text("previous clipboard", encoding="utf-8")
        self.surfaces = command_surfaces()

    def logs(self, content):
        for directory in (self.mac_logs, self.win_logs):
            older = directory / "debug_z_old.log"
            newer = directory / "debug_a_new.log"
            older.write_text("id_token=" + TOKEN_OLD, encoding="utf-8")
            newer.write_text(content, encoding="utf-8")
            os.utime(older, (1000000000, 1000000000))
            os.utime(newer, (1000000010, 1000000010))

    def run_mac(self, command, mode="ok", outer_shell=None):
        tools = self.root / "bin"
        tools.mkdir(exist_ok=True)
        scripts = {
            "pbcopy": '#!/bin/sh\n[ "$TEST_MODE" != copy_fail ] || exit 2\ncat > "$TEST_CLIPBOARD"\n',
            "pbpaste": '#!/bin/sh\n[ "$TEST_MODE" != read_fail ] || exit 2\n'
                       'if [ "$TEST_MODE" = mismatch ]; then printf wrong; else cat "$TEST_CLIPBOARD"; fi\n',
        }
        for name, source in scripts.items():
            path = tools / name
            path.write_text(source, encoding="utf-8", newline="\n")
            path.chmod(0o755)
        environment = {**os.environ, "TEST_HOME": shell_path(self.root), "TEST_BIN": shell_path(tools),
                       "TEST_CLIPBOARD": shell_path(self.clipboard), "TEST_MODE": mode}
        setup = 'export HOME="$TEST_HOME"\nexport PATH="$TEST_BIN:/bin:/usr/bin:$PATH"\n'
        return subprocess.run([outer_shell or BASH, "-s"], input=setup + command + "\n", env=environment,
                              text=True, capture_output=True, timeout=20)

    def run_windows(self, command, mode="ok"):
        import base64

        environment = {**os.environ, "APPDATA": str(self.root / "AppData"),
                       "TEST_CLIPBOARD": str(self.clipboard), "TEST_MODE": mode}
        adapters = r"""
$ErrorActionPreference = 'Stop'
function Set-Clipboard {
    [CmdletBinding()] param([Parameter(ValueFromPipeline=$true)][AllowEmptyString()][string]$Value)
    process {
        if ($env:TEST_MODE -eq 'copy_fail') { throw 'Synthetic clipboard write failure.' }
        [IO.File]::WriteAllText($env:TEST_CLIPBOARD, $Value)
    }
}
function Get-Clipboard {
    [CmdletBinding()] param([switch]$Raw)
    if ($env:TEST_MODE -eq 'read_fail') { throw 'Synthetic clipboard read failure.' }
    if ($env:TEST_MODE -eq 'mismatch') { return 'wrong' }
    [IO.File]::ReadAllText($env:TEST_CLIPBOARD)
}
"""
        encoded = base64.b64encode((adapters + command).encode("utf-16le")).decode("ascii")
        return subprocess.run([POWERSHELL, "-NoProfile", "-NonInteractive", "-EncodedCommand", encoded],
                              env=environment, text=True, capture_output=True, timeout=20)

    def unique_commands(self, language):
        return sorted(set(code_block(value, language) for value in self.surfaces.values()))

    def assert_secret_not_printed(self, result):
        for token in (TOKEN_OLD, TOKEN_NEW):
            self.assertNotIn(token, result.stdout)
            self.assertNotIn(token, result.stderr)

    @unittest.skipUnless(BASH, "Bash is not installed")
    def test_mac_uses_newest_log_and_last_token_without_printing_it(self):
        self.logs("accessToken = " + TOKEN_OLD + "\nid_token=" + TOKEN_NEW)
        for command in self.unique_commands("bash"):
            result = self.run_mac(command)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(self.clipboard.read_text(encoding="utf-8"), TOKEN_NEW)
            self.assertTrue(result.stdout.strip())
            self.assert_secret_not_printed(result)

    @unittest.skipUnless(BASH, "Bash is not installed")
    def test_mac_accepts_legacy_token_with_whitespace(self):
        self.logs("accessToken\t=\t" + TOKEN_NEW)
        for command in self.unique_commands("bash"):
            result = self.run_mac(command)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(self.clipboard.read_text(encoding="utf-8"), TOKEN_NEW)

    @unittest.skipUnless(BASH, "Bash is not installed")
    def test_mac_does_not_fall_back_to_token_in_older_log(self):
        self.logs("No token in the current log")
        for command in self.unique_commands("bash"):
            result = self.run_mac(command)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(result.stdout, "")
            self.assertEqual(self.clipboard.read_text(encoding="utf-8"), "previous clipboard")

    @unittest.skipUnless(BASH, "Bash is not installed")
    def test_mac_missing_log_or_directory_never_reports_success(self):
        for missing_directory in (False, True):
            if missing_directory:
                self.mac_logs.rmdir()
            for command in self.unique_commands("bash"):
                result = self.run_mac(command)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(result.stdout, "")

    @unittest.skipUnless(BASH, "Bash is not installed")
    def test_mac_clipboard_errors_never_report_success(self):
        self.logs("id_token=" + TOKEN_NEW)
        for mode in ("copy_fail", "read_fail", "mismatch"):
            for command in self.unique_commands("bash"):
                with self.subTest(mode=mode):
                    result = self.run_mac(command, mode)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertEqual(result.stdout, "")
                    self.assert_secret_not_printed(result)

    @unittest.skipUnless(sys.platform == "darwin" and shutil.which("zsh"), "Native macOS zsh check")
    def test_mac_block_can_be_pasted_into_zsh(self):
        self.logs("id_token=" + TOKEN_NEW)
        for command in self.unique_commands("bash"):
            result = self.run_mac(command, outer_shell=shutil.which("zsh"))
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(self.clipboard.read_text(encoding="utf-8"), TOKEN_NEW)
            self.assert_secret_not_printed(result)

    @unittest.skipUnless(POWERSHELL and os.name == "nt", "Native Windows PowerShell check")
    def test_windows_commands_copy_and_confirm_without_printing_token(self):
        self.logs("accessToken = " + TOKEN_OLD + "\nid_token=" + TOKEN_NEW)
        for command in self.unique_commands("powershell"):
            result = self.run_windows(command)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(self.clipboard.read_text(encoding="utf-8"), TOKEN_NEW)
            self.assertTrue(result.stdout.strip())
            self.assert_secret_not_printed(result)

    @unittest.skipUnless(POWERSHELL and os.name == "nt", "Native Windows PowerShell check")
    def test_windows_clipboard_errors_never_report_success(self):
        self.logs("id_token=" + TOKEN_NEW)
        for mode in ("copy_fail", "read_fail", "mismatch"):
            for command in self.unique_commands("powershell"):
                with self.subTest(mode=mode):
                    result = self.run_windows(command, mode)
                    self.assert_secret_not_printed(result)
                    self.assertNotIn("True", result.stdout)
                    self.assertNotIn("successfully", result.stdout)
                    self.assertNotIn("erfolgreich", result.stdout)
                    self.assertTrue(result.returncode != 0 or "False" in result.stdout)

    @unittest.skipUnless(POWERSHELL and os.name == "nt", "Native Windows PowerShell check")
    def test_windows_does_not_report_success_for_a_token_only_in_an_older_log(self):
        self.logs("No token in the current log")
        for command in self.unique_commands("powershell"):
            result = self.run_windows(command)
            self.assertNotIn("True", result.stdout)
            self.assertNotIn("successfully", result.stdout)
            self.assertNotIn("erfolgreich", result.stdout)
            self.assertNotIn(self.clipboard.read_text(encoding="utf-8"), (TOKEN_OLD, TOKEN_NEW))
            self.assert_secret_not_printed(result)

    def test_ui_mac_commands_match_readmes_and_only_declared_placeholders_exist(self):
        for name, text in self.surfaces.items():
            if not name.startswith("README"):
                expected = self.surfaces["README.md" if name.endswith("de.json") else "README.en.md"]
                self.assertEqual(code_block(text, "bash"), code_block(expected, "bash"))
                self.assertEqual(re.findall(r"\{[^}]*\}", text), ["{token_instructions_url}"])

    def test_current_and_legacy_documentation_anchors_resolve(self):
        english = self.surfaces["README.en.md"]
        german = self.surfaces["README.md"]
        self.assertIn('<a id="recover-a-slicer-token-on-windows"></a>', english)
        self.assertIn('<a id="windows-token-aus-dem-laufenden-slicer-auslesen"></a>', german)
        self.assertIn("### Recover a Slicer token (Windows and macOS)", english)
        self.assertIn("## 🔐 Token auslesen (Slicer Next)", german)
        tree = ast.parse((INTEGRATION / "config_flow.py").read_text(encoding="utf-8"))
        links = {node.value for node in ast.walk(tree) if isinstance(node, ast.Constant)
                 and isinstance(node.value, str) and node.value.startswith("README")}
        self.assertIn("README.en.md#recover-a-slicer-token-windows-and-macos", links)
        self.assertIn("README.md#-token-auslesen-slicer-next", links)


if __name__ == "__main__":
    unittest.main()
