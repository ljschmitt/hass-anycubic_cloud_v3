"""Exercise the real coordinator setup methods without a Home Assistant runtime.

Only the HA runtime boundary is stubbed. Methods are compiled from the owning
source so these tests also run in the repository's dependency-free unit suite.
"""
from __future__ import annotations

import ast
import asyncio
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from typing import Any
from unittest.mock import AsyncMock, MagicMock

INTEGRATION_ROOT = Path(__file__).resolve().parents[1] / "custom_components/anycubic_ha_integration"
sys.path.insert(0, str(INTEGRATION_ROOT))

from anycubic_cloud_api.exceptions.exceptions import AnycubicAPIParsingError  # noqa: E402


class ConfigEntryAuthFailed(Exception):
    pass


class ConfigEntryError(Exception):
    pass


class ConfigEntryNotReady(Exception):
    pass


def load_setup_methods(namespace):
    tree = ast.parse((INTEGRATION_ROOT / "coordinator.py").read_text(encoding="utf-8"))
    coordinator = next(node for node in tree.body if isinstance(node, ast.ClassDef)
                       and node.name == "AnycubicCloudDataUpdateCoordinator")
    names = {"_setup_anycubic_api_connection", "_setup_anycubic_printer_objects", "_async_setup"}
    methods = [node for node in coordinator.body if isinstance(node, ast.AsyncFunctionDef) and node.name in names]
    module = ast.Module(body=methods, type_ignores=[])
    exec(compile(module, str(INTEGRATION_ROOT / "coordinator.py"), "exec"), namespace)
    return type("SetupCoordinatorUnderTest", (), {node.name: namespace[node.name] for node in methods})


class SetupErrorHandlingTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.api = MagicMock()
        self.api.check_api_tokens = AsyncMock(return_value=True)
        self.api.printer_info_for_id = AsyncMock(return_value=object())
        self.store = SimpleNamespace(async_save=AsyncMock())
        self.namespace = {
            "Any": Any,
            "ConfigEntryAuthFailed": ConfigEntryAuthFailed,
            "ConfigEntryError": ConfigEntryError,
            "ConfigEntryNotReady": ConfigEntryNotReady,
            "AnycubicAPIParsingError": AnycubicAPIParsingError,
            "Store": MagicMock(), "CookieJar": MagicMock(),
            "async_create_clientsession": MagicMock(), "AnycubicAPI": MagicMock(return_value=self.api),
            "LOGGER": MagicMock(), "asyncio": SimpleNamespace(sleep=AsyncMock()),
            "API_SETUP_RETRIES": 1, "API_SETUP_RETRY_INTERVAL_SECONDS": 0,
        }
        for constant in ("STORAGE_VERSION", "STORAGE_KEY", "CONF_USER_TOKEN", "CONF_USER_AUTH_MODE",
                         "CONF_USER_DEVICE_ID", "CONF_DEBUG_DEPRECATED", "CONF_DEBUG_MQTT_MSG",
                         "CONF_DEBUG_API_CALLS", "CONF_PRINTER_ID_LIST"):
            self.namespace[constant] = constant
        self.namespace["Store"].__getitem__.return_value.return_value = self.store
        coordinator_type = load_setup_methods(self.namespace)
        self.coordinator = coordinator_type()
        self.coordinator.entry = SimpleNamespace(
            data={"CONF_USER_TOKEN": "synthetic-token", "CONF_PRINTER_ID_LIST": [1]}, options={}, entry_id="synthetic-entry"
        )
        self.coordinator.hass = MagicMock()
        self.coordinator._mqtt_callback_data_updated = MagicMock()
        self.coordinator._mqtt_callback_print_job_started = MagicMock()
        self.coordinator._mqtt_callback_subscribed = MagicMock()
        self.coordinator._anycubic_printers = {}
        self.coordinator._async_request_missing_multi_color_box_info_after_startup = AsyncMock()

    async def test_genuine_login_rejection_still_requests_reauthentication(self):
        self.api.check_api_tokens.return_value = False
        with self.assertRaises(ConfigEntryAuthFailed):
            await self.coordinator._setup_anycubic_api_connection()
        self.api.printer_info_for_id.assert_not_awaited()

    async def test_response_data_errors_are_retryable_and_do_not_request_reauthentication(self):
        for error in (KeyError("required_field"), TypeError("null integer field"), ValueError("invalid field")):
            with self.subTest(error=type(error).__name__):
                self.api.printer_info_for_id.side_effect = error
                with self.assertRaises(AnycubicAPIParsingError):
                    await self.coordinator._setup_anycubic_api_connection()
                self.api.printer_info_for_id.assert_awaited()
                self.assertEqual(self.coordinator.entry.data["CONF_USER_TOKEN"], "synthetic-token")

    async def test_unexpected_setup_error_does_not_request_reauthentication(self):
        self.api.printer_info_for_id.side_effect = RuntimeError("synthetic setup failure")
        with self.assertRaises(ConfigEntryError):
            await self.coordinator._setup_anycubic_api_connection()
        self.api.printer_info_for_id.assert_awaited_once()

    async def test_missing_printer_is_configuration_error_not_authentication_failure(self):
        self.api.printer_info_for_id.return_value = None
        with self.assertRaises(ConfigEntryError):
            await self.coordinator._setup_anycubic_api_connection()
        self.api.printer_info_for_id.assert_awaited_once()

    async def test_data_errors_while_loading_other_printers_remain_retryable(self):
        self.coordinator.anycubic_api = self.api
        for error in (AnycubicAPIParsingError("unavailable response"), TypeError("null integer field")):
            with self.subTest(error=type(error).__name__):
                self.api.printer_info_for_id.side_effect = error
                with self.assertRaises(AnycubicAPIParsingError):
                    await self.coordinator._setup_anycubic_printer_objects()

    async def test_exhausted_cloud_retries_schedule_ha_retry_without_new_credentials(self):
        self.coordinator._setup_anycubic_api_connection = AsyncMock(side_effect=AnycubicAPIParsingError("unavailable data"))
        self.coordinator._setup_anycubic_printer_objects = AsyncMock()
        with self.assertRaises(ConfigEntryNotReady):
            await self.coordinator._async_setup()
        self.assertEqual(self.coordinator._setup_anycubic_api_connection.await_count, 2)
        self.coordinator._setup_anycubic_printer_objects.assert_not_awaited()
        self.coordinator.hass.create_task.assert_not_called()

    async def test_recovered_cloud_response_completes_setup_with_original_token(self):
        self.coordinator._setup_anycubic_api_connection = AsyncMock(side_effect=[AnycubicAPIParsingError("temporary data"), None])
        self.coordinator._setup_anycubic_printer_objects = AsyncMock()
        task = asyncio.create_task(asyncio.sleep(0))
        self.coordinator._async_request_missing_multi_color_box_info_after_startup = MagicMock(return_value=task)
        try:
            await self.coordinator._async_setup()
            self.assertEqual(self.coordinator._setup_anycubic_api_connection.await_count, 2)
            self.coordinator._setup_anycubic_printer_objects.assert_awaited_once()
            self.coordinator.hass.create_task.assert_called_once()
            self.assertEqual(self.coordinator.entry.data["CONF_USER_TOKEN"], "synthetic-token")
        finally:
            await task


if __name__ == "__main__":
    unittest.main()
