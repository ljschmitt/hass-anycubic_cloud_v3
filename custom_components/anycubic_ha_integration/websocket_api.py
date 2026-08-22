"""WebSocket API for Anycubic Cloud."""
from __future__ import annotations

import base64
import time
from typing import Any

import voluptuous as vol
from aiohttp import ClientError, ClientTimeout
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import COORDINATOR, DOMAIN
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .file_preview import find_project_preview_url, normalize_preview_filename

WS_TYPE_CAMERA_SESSION = f"{DOMAIN}/camera_session"
WS_TYPE_FILE_PREVIEW = f"{DOMAIN}/file_preview"

FILE_PREVIEW_CACHE = "file_preview_cache"
FILE_PREVIEW_CACHE_TTL_SECONDS = 300
FILE_PREVIEW_MAX_CACHE_ENTRIES = 16
FILE_PREVIEW_MAX_BYTES = 1024 * 1024
FILE_PREVIEW_TIMEOUT_SECONDS = 15


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register Anycubic Cloud websocket commands."""
    websocket_api.async_register_command(hass, websocket_camera_session)
    websocket_api.async_register_command(hass, websocket_file_preview)


async def _async_fetch_preview_data_url(
    hass: HomeAssistant,
    image_url: str,
) -> str | None:
    """Fetch a project image through Home Assistant and return a bounded data URL."""
    if not image_url.startswith("https://"):
        return None

    session = async_get_clientsession(hass)
    try:
        async with session.get(
            image_url,
            timeout=ClientTimeout(total=FILE_PREVIEW_TIMEOUT_SECONDS),
        ) as response:
            if response.status != 200:
                return None

            content_type = response.headers.get("Content-Type", "").split(";", 1)[0].lower()
            if not content_type.startswith("image/"):
                return None

            content_length = response.content_length
            if content_length is not None and content_length > FILE_PREVIEW_MAX_BYTES:
                return None

            content = bytearray()
            async for chunk in response.content.iter_chunked(64 * 1024):
                content.extend(chunk)
                if len(content) > FILE_PREVIEW_MAX_BYTES:
                    return None
            if not content:
                return None
    except (ClientError, TimeoutError):
        return None

    encoded = base64.b64encode(content).decode("ascii")
    return f"data:{content_type};base64,{encoded}"


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_FILE_PREVIEW,
        vol.Required("config_entry"): str,
        vol.Required("printer_id"): vol.Coerce(int),
        vol.Required("source"): vol.In(("local", "udisk")),
        vol.Required("filename"): str,
    }
)
@websocket_api.async_response
async def websocket_file_preview(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return an exact printer-project preview without exposing its remote URL."""
    entry_data = hass.data.get(DOMAIN, {}).get(msg["config_entry"])
    if not entry_data:
        connection.send_error(
            msg["id"],
            "config_entry_not_found",
            "Could not find Anycubic Cloud config entry.",
        )
        return

    coordinator: AnycubicCloudDataUpdateCoordinator = entry_data[COORDINATOR]
    printer_id = msg["printer_id"]
    if coordinator.get_printer_for_id(printer_id) is None:
        connection.send_error(
            msg["id"],
            "printer_not_found",
            "Could not find Anycubic printer.",
        )
        return

    cache_key = (
        printer_id,
        msg["source"],
        normalize_preview_filename(msg["filename"]),
    )
    cache: dict[tuple[int, str, str], tuple[float, str | None]] = entry_data.setdefault(
        FILE_PREVIEW_CACHE,
        {},
    )
    cached = cache.get(cache_key)
    now = time.monotonic()
    if cached and now - cached[0] < FILE_PREVIEW_CACHE_TTL_SECONDS:
        connection.send_result(msg["id"], {"image": cached[1]})
        return

    request_succeeded = False
    try:
        projects = await coordinator.anycubic_api.list_all_projects()
        image_url = find_project_preview_url(projects, printer_id, msg["filename"])
        image_data = (
            await _async_fetch_preview_data_url(hass, image_url)
            if image_url
            else None
        )
        request_succeeded = True
    except Exception:  # noqa: BLE001
        image_data = None

    if request_succeeded:
        if len(cache) >= FILE_PREVIEW_MAX_CACHE_ENTRIES:
            oldest_key = min(cache, key=lambda key: cache[key][0])
            cache.pop(oldest_key, None)
        cache[cache_key] = (now, image_data)
    connection.send_result(msg["id"], {"image": image_data})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_CAMERA_SESSION,
        vol.Required("config_entry"): str,
        vol.Required("printer_id"): vol.Coerce(int),
    }
)
@websocket_api.async_response
async def websocket_camera_session(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return a short-lived camera session for a printer."""
    entry_id = msg["config_entry"]
    printer_id = msg["printer_id"]

    entry_data = hass.data.get(DOMAIN, {}).get(entry_id)
    if not entry_data:
        connection.send_error(
            msg["id"],
            "config_entry_not_found",
            "Could not find Anycubic Cloud config entry.",
        )
        return

    coordinator: AnycubicCloudDataUpdateCoordinator = entry_data[COORDINATOR]
    printer = coordinator.get_printer_for_id(printer_id)
    if printer is None:
        connection.send_error(
            msg["id"],
            "printer_not_found",
            "Could not find Anycubic printer.",
        )
        return

    try:
        camera_session = await printer.get_camera_session()
    except Exception:  # noqa: BLE001
        connection.send_error(
            msg["id"],
            "camera_session_failed",
            "Could not create a camera session.",
        )
        return

    if camera_session is None:
        connection.send_error(
            msg["id"],
            "camera_session_empty",
            "No camera session returned.",
        )
        return

    connection.send_result(msg["id"], camera_session.data)
