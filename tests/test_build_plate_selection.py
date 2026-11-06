"""Verify plate commands without writing to a real printer."""
from __future__ import annotations

import ast
import asyncio
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock

import test_loaded_slot
from anycubic_cloud_api.const.enums import KOBRA_X_BUILD_PLATE_TYPES, AnycubicOrderID
from anycubic_cloud_api.data_models.orders import AnycubicDataOrderRequest
from anycubic_cloud_api.exceptions.exceptions import AnycubicAPIError
from test_print_time_units import printer


def load_method(file, class_name, name, **namespace):
    tree = ast.parse((test_loaded_slot.INTEGRATION_ROOT / file).read_text(encoding="utf-8"))
    cls = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == class_name)
    method = next(node for node in cls.body if isinstance(node, ast.AsyncFunctionDef) and node.name == name)
    exec(compile(ast.Module(body=[method], type_ignores=[]), file, "exec"), namespace)
    return namespace[name]


class HomeAssistantError(Exception):
    pass


select_plate = load_method(
    "coordinator.py", "AnycubicCloudDataUpdateCoordinator", "async_select_build_plate",
    KOBRA_X_BUILD_PLATE_TYPES=KOBRA_X_BUILD_PLATE_TYPES, HomeAssistantError=HomeAssistantError,
    AnycubicAPIError=AnycubicAPIError, asyncio=SimpleNamespace(timeout=asyncio.timeout, sleep=AsyncMock()),
)


class BuildPlateSelectionTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.device = printer(model=20030)
        self.device._device_status = 1
        self.properties = {
            "device_status": "online", "device_state": 0, "head_channel_count": 4,
            "hotbed_settings": {"material": 1}, "hardware_settings": {"diameter": "0.4", "material": 2},
        }
        self.device.apply_hardware_properties(self.properties)
        self.api = SimpleNamespace(query_printer_hardware=AsyncMock(return_value=self.properties),
                                   send_build_plate_order=AsyncMock(return_value=True))
        self.coordinator = SimpleNamespace(
            get_printer_for_id=lambda printer_id: self.device, anycubic_api=self.api,
            _async_force_data_refresh=AsyncMock(), _build_plate_write_lock=asyncio.Lock(),
        )

    async def test_success_uses_readback_and_preserves_nozzle(self):
        self.api.query_printer_hardware.side_effect = [
            self.properties, self.properties, {"hotbed_settings": {"material": 2}},
        ]
        await select_plate(self.coordinator, 1, "smooth_transfer_plate")
        self.api.send_build_plate_order.assert_awaited_once_with(self.device, 2, 4)
        self.assertEqual(self.api.query_printer_hardware.await_count, 3)
        self.assertEqual(self.device.build_plate_type, "smooth_transfer_plate")
        self.assertEqual(self.device.hardware_settings["nozzle_diameter"], 0.4)
        self.assertEqual(test_loaded_slot.build_sensor_data(self.device)["states"]["build_plate_selection"], "smooth_transfer_plate")

    async def test_same_plate_never_sends_an_order(self):
        await select_plate(self.coordinator, 1, "textured_pei_plate")
        self.api.send_build_plate_order.assert_not_awaited()

    async def test_busy_offline_and_unknown_status_are_rejected(self):
        for overrides in ({"device_state": 2}, {"device_status": "offline"}, {"device_state": None}):
            with self.subTest(overrides=overrides):
                self.api.query_printer_hardware.return_value = {**self.properties, **overrides}
                with self.assertRaisesRegex(HomeAssistantError, "online and idle"):
                    await select_plate(self.coordinator, 1, "smooth_transfer_plate")
        self.api.send_build_plate_order.assert_not_awaited()

    async def test_failed_confirmation_keeps_reported_plate(self):
        self.api.query_printer_hardware.side_effect = [self.properties, TimeoutError()]
        with self.assertRaisesRegex(HomeAssistantError, "Could not confirm"):
            await select_plate(self.coordinator, 1, "smooth_transfer_plate")
        self.assertEqual(self.device.build_plate_type, "textured_pei_plate")
        self.coordinator._async_force_data_refresh.assert_not_awaited()

    async def test_other_models_have_no_selection(self):
        self.device = printer(model=20029)
        self.device.apply_hardware_properties(self.properties)
        self.assertIsNone(test_loaded_slot.build_sensor_data(self.device)["states"]["build_plate_selection"])
        with self.assertRaisesRegex(HomeAssistantError, "unsupported"):
            await select_plate(self.coordinator, 1, "smooth_transfer_plate")
        self.api.query_printer_hardware.assert_not_awaited()
        self.api.send_build_plate_order.assert_not_awaited()

    async def test_cloud_order_matches_slicer_shape_without_project(self):
        send_order = load_method(
            "anycubic_cloud_api/api/functions.py", "AnycubicAPIFunctions", "send_build_plate_order",
            AnycubicDataOrderRequest=AnycubicDataOrderRequest, AnycubicOrderID=AnycubicOrderID,
            AnycubicPrinter=type(self.device),
        )
        api = SimpleNamespace(_send_anycubic_order=AsyncMock(return_value={"code": 1, "data": {"msgid": "ack"}}))
        self.assertTrue(await send_order(api, self.device, 2, 4))
        order = api._send_anycubic_order.await_args.args[0]
        self.assertEqual(order.order_request_data, {
            "order_id": 1253, "printer_id": 1,
            "data": {"hotbed_settings": {"material": 2}, "head_channel_count": 4},
        })
        api._send_anycubic_order.return_value = {"code": 0, "data": {"msgid": "ack"}}
        self.assertFalse(await send_order(api, self.device, 2, 4))
