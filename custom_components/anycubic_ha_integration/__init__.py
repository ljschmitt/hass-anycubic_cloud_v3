"""The anycubic_cloud component."""
from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_CARD_CONFIG,
    COORDINATOR,
    DOMAIN,
    PLATFORMS,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .panel import async_register_panel, async_unregister_panel
from .services import SERVICES
from .websocket_api import async_register_websocket_api

WEBSOCKET_API_REGISTERED = "websocket_api_registered"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Anycubic Cloud from a config entry."""

    coordinator = AnycubicCloudDataUpdateCoordinator(hass, entry)

    await coordinator.async_config_entry_first_refresh()
    domain_data = hass.data.setdefault(DOMAIN, {})
    if not domain_data.get(WEBSOCKET_API_REGISTERED):
        async_register_websocket_api(hass)
        domain_data[WEBSOCKET_API_REGISTERED] = True

    domain_data[entry.entry_id] = {
        COORDINATOR: coordinator,
    }

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(update_listener))

    # register service calls
    for service_name, service in SERVICES:
        if not hass.services.has_service(DOMAIN, service_name):
            hass.services.async_register(
                DOMAIN,
                service_name,
                service(hass).async_call_service,
                service.schema,
            )

    # register panel
    await async_register_panel(
        hass,
        entry.options.get(CONF_CARD_CONFIG)
    )

    return True


async def update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""

    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False

    domain_data = hass.data[DOMAIN]
    host = domain_data.get(entry.entry_id)
    if host is None:
        return True

    await host[COORDINATOR].stop_anycubic_mqtt_connection_if_started()
    domain_data.pop(entry.entry_id)

    # The WebSocket and image routes stay registered for the HA process.
    if not any(isinstance(data, dict) and COORDINATOR in data for data in domain_data.values()):
        for service_name, _ in SERVICES:
            hass.services.async_remove(DOMAIN, service_name)
        async_unregister_panel(hass)

    return True
