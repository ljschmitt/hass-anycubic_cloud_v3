"""WebSocket API for Anycubic Cloud."""
from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import (
    COORDINATOR,
    DOMAIN,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator

WS_TYPE_CAMERA_SESSION = f"{DOMAIN}/camera_session"


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register Anycubic Cloud websocket commands."""
    websocket_api.async_register_command(hass, websocket_camera_session)


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
