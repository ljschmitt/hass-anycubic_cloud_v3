"""Anycubic Cloud frontend panel."""
from __future__ import annotations

import json
import os
from typing import Any

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    CUSTOM_COMPONENTS,
    DOMAIN,
    INTEGRATION_FOLDER,
    LOGGER,
    PANEL_FILENAME,
    PANEL_FOLDER,
    PANEL_ICON,
    PANEL_NAME,
    PANEL_TITLE,
)
from .helpers import extract_panel_card_config

PANEL_URL = "/anycubic-cloud-panel-static"
HARDWARE_IMAGES_URL = "/anycubic-cloud-hardware"


def process_card_config(
    conf_object: Any,
) -> dict[str, Any]:
    if isinstance(conf_object, dict):
        return extract_panel_card_config(conf_object)
    else:
        return {}


def get_panel_module_url(root_dir: str) -> str:
    manifest_path = os.path.join(root_dir, "manifest.json")
    panel_path = os.path.join(root_dir, PANEL_FOLDER, PANEL_FILENAME)
    try:
        with open(manifest_path, encoding="utf-8") as manifest_file:
            manifest = json.load(manifest_file)
    except (OSError, ValueError):
        return PANEL_URL

    version = manifest.get("version")
    if not version:
        return PANEL_URL

    try:
        panel_mtime = int(os.path.getmtime(panel_path))
    except OSError:
        panel_mtime = 0

    return f"{PANEL_URL}?v={version}.{panel_mtime}"


async def async_register_panel(
    hass: HomeAssistant,
    conf_object: Any,
) -> None:
    """Register the Anycubic Cloud frontend panel."""
    if DOMAIN not in hass.data.get("frontend_panels", {}):
        root_dir = os.path.join(hass.config.path(CUSTOM_COMPONENTS), INTEGRATION_FOLDER)
        module_url = await hass.async_add_executor_job(get_panel_module_url, root_dir)
        domain_data = hass.data.setdefault(DOMAIN, {})
        if not domain_data.get("hardware_images_registered"):
            await hass.http.async_register_static_paths(
                [StaticPathConfig(HARDWARE_IMAGES_URL, os.path.join(root_dir, "hardware_images"), cache_headers=False)]
            )
            domain_data["hardware_images_registered"] = True
        try:
            await hass.http.async_register_static_paths(
                [StaticPathConfig(PANEL_URL, os.path.join(root_dir, PANEL_FOLDER, PANEL_FILENAME), cache_headers=False)]
            )
        except RuntimeError as e:
            if "already registered" not in str(e):
                raise e

        conf = process_card_config(conf_object)

        LOGGER.debug(f"Processed panel config: {conf}")

        await panel_custom.async_register_panel(
            hass,
            webcomponent_name=PANEL_NAME,
            frontend_url_path=DOMAIN,
            module_url=module_url,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=False,
            config=conf,
        )


def async_unregister_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, DOMAIN)
    LOGGER.debug("Removing panel")
