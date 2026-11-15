"""Prepare a receive-only Kinesis WebRTC session for the Kobra 2 Max."""
from __future__ import annotations

import asyncio
import hashlib
import hmac
import json
import re
import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any
from urllib.parse import quote, urlsplit

from .data_models.orders import AnycubicCameraToken

if TYPE_CHECKING:
    from aiohttp import ClientSession

SERVICE = "kinesisvideo"
SIGNATURE_ALGORITHM = "AWS4-HMAC-SHA256"


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _canonical_query(query: dict[str, str]) -> str:
    return "&".join(f"{quote(key, safe='')}={quote(value, safe='')}" for key, value in sorted(query.items()))


class _ViewerSigner:
    """Sign only the Kinesis requests needed by the camera viewer."""

    def __init__(self, token: AnycubicCameraToken, now: datetime) -> None:
        self.token = token
        self.timestamp = now.strftime("%Y%m%dT%H%M%SZ")
        day = self.timestamp[:8]
        self.scope = f"{day}/{token.region}/{SERVICE}/aws4_request"
        key = f"AWS4{token.secret_key}".encode()
        for part in (day, token.region, SERVICE, "aws4_request"):
            key = hmac.digest(key, part.encode(), "sha256")
        self.signing_key = key

    def signature(self, method: str, path: str, query: str, headers: dict[str, str], body: bytes) -> str:
        signed_headers = ";".join(sorted(headers))
        canonical_headers = "".join(f"{name}:{headers[name]}\n" for name in sorted(headers))
        request = "\n".join((method, path, query, canonical_headers, signed_headers, _sha256(body)))
        to_sign = "\n".join((SIGNATURE_ALGORITHM, self.timestamp, self.scope, _sha256(request.encode())))
        return hmac.new(self.signing_key, to_sign.encode(), hashlib.sha256).hexdigest()

    def post_headers(self, host: str, path: str, body: bytes) -> dict[str, str]:
        headers = {
            "content-type": "application/json",
            "host": host,
            "x-amz-date": self.timestamp,
            "x-amz-security-token": self.token.session_token,
        }
        signature = self.signature("POST", path, "", headers, body)
        signed_headers = ";".join(sorted(headers))
        headers["authorization"] = (
            f"{SIGNATURE_ALGORITHM} Credential={self.token.secret_id}/{self.scope}, "
            f"SignedHeaders={signed_headers}, Signature={signature}"
        )
        return headers

    def viewer_url(self, host: str, channel_arn: str, client_id: str) -> str:
        query = _canonical_query({
            "X-Amz-Algorithm": SIGNATURE_ALGORITHM,
            "X-Amz-ChannelARN": channel_arn,
            "X-Amz-ClientId": client_id,
            "X-Amz-Credential": f"{self.token.secret_id}/{self.scope}",
            "X-Amz-Date": self.timestamp,
            "X-Amz-Expires": "60",
            "X-Amz-Security-Token": self.token.session_token,
            "X-Amz-SignedHeaders": "host",
        })
        signature = self.signature("GET", "/", query, {"host": host}, b"")
        return f"wss://{host}/?{query}&X-Amz-Signature={signature}"


def _endpoint_host(endpoint: str, region: str) -> str:
    url = urlsplit(endpoint)
    suffix = f".{SERVICE}.{region}.amazonaws.com"
    if (
        url.scheme != "https"
        or not url.netloc.endswith(suffix)
        or not re.fullmatch(r"[a-z0-9.-]+", url.netloc)
        or url.path not in ("", "/")
        or url.query
        or url.fragment
    ):
        raise ValueError("Unexpected Kinesis endpoint")
    return url.netloc


async def _request(
    client: ClientSession, signer: _ViewerSigner, host: str, path: str, data: dict[str, Any],
) -> dict[str, Any]:
    body = json.dumps(data, separators=(",", ":")).encode()
    async with asyncio.timeout(8), client.post(
        f"https://{host}{path}", data=body, headers=signer.post_headers(host, path, body), allow_redirects=False,
    ) as response:
        if response.status != 200:
            raise ValueError(f"Kinesis {path} failed ({response.status})")
        result = await response.json()
    if not isinstance(result, dict):
        raise ValueError("Invalid Kinesis response")
    return result


async def prepare_legacy_camera(
    client: ClientSession, token: AnycubicCameraToken, channel: str,
) -> dict[str, Any]:
    """Look up the printer's channel without returning the AWS signing credentials."""
    region = token.region
    if not re.fullmatch(r"[a-z]{2}(?:-[a-z]+)+-\d", region):
        raise ValueError("Invalid Kinesis region")
    if not re.fullmatch(r"[a-zA-Z0-9_.-]{1,256}", channel):
        raise ValueError("Invalid Kinesis channel name")
    signer = _ViewerSigner(token, datetime.now(UTC))
    host = f"{SERVICE}.{region}.amazonaws.com"
    channel_response = await _request(client, signer, host, "/describeSignalingChannel", {"ChannelName": channel})
    arn = channel_response["ChannelInfo"]["ChannelARN"]
    configuration = {"Protocols": ["WSS", "HTTPS"], "Role": "VIEWER"}
    endpoints = await _request(client, signer, host, "/getSignalingChannelEndpoint", {
        "ChannelARN": arn, "SingleMasterChannelEndpointConfiguration": configuration,
    })
    raw_endpoints = {item["Protocol"]: item["ResourceEndpoint"] for item in endpoints["ResourceEndpointList"]}
    https_host = _endpoint_host(raw_endpoints["HTTPS"], region)
    wss_host = _endpoint_host(raw_endpoints["WSS"].replace("wss://", "https://", 1), region)
    ice = await _request(client, signer, https_host, "/v1/get-ice-server-config", {"ChannelARN": arn})
    ice_servers: list[dict[str, Any]] = [{"urls": f"stun:stun.{SERVICE}.{region}.amazonaws.com:443"}]
    ice_servers.extend(
        {"urls": server["Uris"], "username": server["Username"], "credential": server["Password"]}
        for server in ice.get("IceServerList", [])
    )
    # Sign after setup so the single-viewer URL has its full TTL when returned.
    viewer_url = _ViewerSigner(token, datetime.now(UTC)).viewer_url(wss_host, arn, uuid.uuid4().hex)
    return {"transport": "kinesis", "signaling_url": viewer_url, "ice_servers": ice_servers}
