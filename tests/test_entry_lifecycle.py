"""Exercise account unload and reload without connecting to a printer."""
from __future__ import annotations

import ast
import json
import os
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = "anycubic_ha_integration"
INTEGRATION = ROOT / "custom_components" / DOMAIN
PANEL_URL = "/anycubic-cloud-panel-static"
IMAGES_URL = "/anycubic-cloud-hardware"


def load_functions(filename, namespace):
    source = INTEGRATION / filename
    tree = ast.parse(source.read_text(encoding="utf-8"), filename=str(source))
    functions = [node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))]
    exec(compile(ast.Module(body=functions, type_ignores=[]), str(source), "exec"), namespace)


class EntryLifecycleTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.routes = {}
        self.services = {}
        self.panels = {}
        self.coordinators = {}
        self.hass = SimpleNamespace(
            data={"frontend_panels": self.panels},
            config=SimpleNamespace(path=lambda folder: ROOT / folder),
            config_entries=SimpleNamespace(
                async_forward_entry_setups=AsyncMock(),
                async_unload_platforms=AsyncMock(return_value=True),
            ),
            services=SimpleNamespace(
                has_service=lambda domain, name: (domain, name) in self.services,
                async_register=lambda domain, name, handler, schema: self.services.update({(domain, name): handler}),
                async_remove=lambda domain, name: self.services.pop((domain, name)),
            ),
            http=SimpleNamespace(async_register_static_paths=AsyncMock(side_effect=self.register_paths)),
            async_add_executor_job=AsyncMock(side_effect=lambda func, *args: func(*args)),
        )
        self.register_websocket = Mock()
        service = Mock(schema={})
        panel_namespace = {
            "DOMAIN": DOMAIN, "CUSTOM_COMPONENTS": "custom_components", "INTEGRATION_FOLDER": DOMAIN,
            "PANEL_URL": PANEL_URL, "HARDWARE_IMAGES_URL": IMAGES_URL,
            "PANEL_FOLDER": "frontend_panel", "PANEL_FILENAME": "dist/anycubic-cloud-panel.js",
            "PANEL_ICON": "mdi:printer-3d", "PANEL_NAME": "anycubic-cloud-panel", "PANEL_TITLE": "Anycubic Cloud",
            "LOGGER": Mock(), "os": os, "json": json, "StaticPathConfig": self.static_path,
            "panel_custom": SimpleNamespace(async_register_panel=AsyncMock(side_effect=self.register_panel)),
            "frontend": SimpleNamespace(async_remove_panel=lambda hass, domain: self.panels.pop(domain)),
        }
        load_functions("panel.py", panel_namespace)
        self.lifecycle = {
            "DOMAIN": DOMAIN, "CONF_CARD_CONFIG": "card", "COORDINATOR": "coordinator", "PLATFORMS": ("select",),
            "SERVICES": [("example_action", service)], "WEBSOCKET_API_REGISTERED": "websocket_api_registered",
            "AnycubicCloudDataUpdateCoordinator": self.create_coordinator,
            "async_register_websocket_api": self.register_websocket,
            "async_register_panel": panel_namespace["async_register_panel"],
            "async_unregister_panel": panel_namespace["async_unregister_panel"],
        }
        load_functions("__init__.py", self.lifecycle)

    @staticmethod
    def static_path(url, path, *, cache_headers):
        return SimpleNamespace(url=url, path=Path(path), cache_headers=cache_headers)

    async def register_paths(self, paths):
        for route in paths:
            if route.url in self.routes:
                raise RuntimeError("already registered")
            self.routes[route.url] = route

    async def register_panel(self, hass, **kwargs):
        self.panels[kwargs["frontend_url_path"]] = kwargs["module_url"]

    def create_coordinator(self, hass, entry):
        coordinator = SimpleNamespace(
            async_config_entry_first_refresh=AsyncMock(),
            stop_anycubic_mqtt_connection_if_started=AsyncMock(),
        )
        self.coordinators[entry.entry_id] = coordinator
        return coordinator

    async def setup(self, name):
        entry = SimpleNamespace(entry_id=name, options={}, add_update_listener=Mock(), async_on_unload=Mock())
        self.assertTrue(await self.lifecycle["async_setup_entry"](self.hass, entry))
        return entry

    async def unload(self, entry):
        return await self.lifecycle["async_unload_entry"](self.hass, entry)

    async def test_last_unload_removes_shared_ui_and_reload_reuses_images(self):
        first = await self.setup("first")
        second = await self.setup("second")
        route = self.routes[IMAGES_URL]

        self.assertTrue(await self.unload(first))
        self.assertIn(DOMAIN, self.panels)
        self.assertIn((DOMAIN, "example_action"), self.services)
        self.coordinators["first"].stop_anycubic_mqtt_connection_if_started.assert_awaited_once()
        self.coordinators["second"].stop_anycubic_mqtt_connection_if_started.assert_not_awaited()

        self.assertTrue(await self.unload(second))
        self.assertNotIn(DOMAIN, self.panels)
        self.assertFalse(self.services)
        self.assertTrue(await self.unload(second))

        await self.setup("second")
        self.assertIn((DOMAIN, "example_action"), self.services)
        self.assertTrue(self.panels[DOMAIN].startswith(PANEL_URL + "?v="))
        self.assertTrue(self.routes[PANEL_URL].path.is_file())
        self.assertIs(self.routes[IMAGES_URL], route)
        self.register_websocket.assert_called_once_with(self.hass)
        for filename in ("textured_pei_plate", "smooth_transfer_plate", "low_temperature_plate", "brass", "hardened_steel"):
            self.assertTrue((route.path / f"{filename}.png").read_bytes().startswith(b"\x89PNG\r\n\x1a\n"))

    async def test_failed_unload_keeps_account_services_and_panel(self):
        entry = await self.setup("first")
        self.hass.config_entries.async_unload_platforms.return_value = False

        self.assertFalse(await self.unload(entry))
        self.assertIn("first", self.hass.data[DOMAIN])
        self.assertIn(DOMAIN, self.panels)
        self.assertIn((DOMAIN, "example_action"), self.services)
        self.coordinators["first"].stop_anycubic_mqtt_connection_if_started.assert_not_awaited()
