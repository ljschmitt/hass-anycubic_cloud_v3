"""Exercise preset buttons through the real printer and order serializer, offline."""
from __future__ import annotations

import ast
import copy
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

from test_loaded_slot import ace

ROOT = Path(__file__).resolve().parents[1] / "custom_components/anycubic_ha_integration"
sys.path.insert(0, str(ROOT))

from anycubic_cloud_api.const.enums import AnycubicOrderID  # noqa: E402
from anycubic_cloud_api.data_models.orders import AnycubicProjectOrderRequest  # noqa: E402
from anycubic_cloud_api.data_models.printer import AnycubicPrinter  # noqa: E402
from anycubic_cloud_api.exceptions.exceptions import AnycubicAPIError  # noqa: E402


def methods(file, owner, names, namespace):
    tree = ast.parse((ROOT / file).read_text(encoding="utf-8"))
    cls = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == owner)
    selected = [n for n in cls.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name in names]
    assert len(selected) == len(names)
    # Keep the actual method bodies; replace only cloud and Home Assistant boundaries.
    module = ast.Module(body=[ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0),
                              *selected], type_ignores=[])
    ast.fix_missing_locations(module)
    exec(compile(module, file, "exec"), namespace)
    return namespace


API_METHOD_NAMES = {
    "_send_order_multi_color_box_dry", "multi_color_box_drying_start", "multi_color_box_drying_stop",
    "_send_order_multi_color_auto_feed", "_set_multi_color_box_auto_feed",
    "multi_color_box_switch_on_auto_feed", "multi_color_box_switch_off_auto_feed",
}
API_METHODS = methods("anycubic_cloud_api/api/functions.py", "AnycubicAPIFunctions", API_METHOD_NAMES,
                      {"AnycubicProjectOrderRequest": AnycubicProjectOrderRequest, "AnycubicOrderID": AnycubicOrderID})
API = type("OfflineAPI", (), {k: API_METHODS[k] for k in API_METHOD_NAMES})


class ACEDryingTests(unittest.IsolatedAsyncioTestCase):
    async def test_ace_refresh_uses_existing_mqtt_and_throttles_each_printer(self):
        clock = SimpleNamespace(monotonic=lambda: 10)
        def make_printer(printer_id, *, online=True, has_ace=True, is_kobra_x=False):
            return SimpleNamespace(
                id=printer_id, printer_online=online, supports_function_multi_color_box=True,
                has_peripheral_multi_color_box=has_ace, is_kobra_x=is_kobra_x,
                multi_color_box_request_info=AsyncMock(),
            )

        names = {"_request_ace_info", "_refresh_ace_info", "_printer_supports_ace_info_request", "button_press_event"}
        namespace = methods("coordinator.py", "AnycubicCloudDataUpdateCoordinator", names, {
            "time": clock, "MQTT_ACE_INFO_REFRESH_INTERVAL": 300,
            "AnycubicAPIError": AnycubicAPIError, "ClientError": OSError,
            "HomeAssistantError": RuntimeError, "ENTITY_ID_DRYING_START_PRESET_": "drying_start_preset_",
        })
        coordinator = type("OfflineCoordinator", (), {name: namespace[name] for name in names})()
        online_ace = make_printer(1)
        offline_ace = make_printer(2, online=False)
        no_ace = make_printer(3, has_ace=False)
        kobra_x = make_printer(4, is_kobra_x=True)
        coordinator._anycubic_printers = {p.id: p for p in (online_ace, offline_ace, no_ace, kobra_x)}
        coordinator._mqtt_last_multi_color_info_request = {}
        coordinator.anycubic_api = SimpleNamespace(mqtt_is_connected=False)

        await coordinator._refresh_ace_info()
        online_ace.multi_color_box_request_info.assert_not_awaited()
        coordinator.anycubic_api.mqtt_is_connected = True
        await coordinator._refresh_ace_info(after_subscribe=True)
        await coordinator._refresh_ace_info()
        online_ace.multi_color_box_request_info.assert_awaited_once()
        kobra_x.multi_color_box_request_info.assert_awaited_once()
        offline_ace.multi_color_box_request_info.assert_not_awaited()
        no_ace.multi_color_box_request_info.assert_not_awaited()

        clock.monotonic = lambda: 310
        await coordinator._refresh_ace_info()
        self.assertEqual(online_ace.multi_color_box_request_info.await_count, 2)
        self.assertEqual(kobra_x.multi_color_box_request_info.await_count, 2)

        coordinator.get_printer_for_id = coordinator._anycubic_printers.get
        coordinator._connect_mqtt_for_action_response = AsyncMock()
        coordinator.force_state_update = AsyncMock()
        await coordinator.button_press_event(1, "request_ace_info")
        coordinator._connect_mqtt_for_action_response.assert_awaited_once()
        self.assertEqual(online_ace.multi_color_box_request_info.await_count, 3)
        coordinator.anycubic_api.mqtt_is_connected = False
        with self.assertRaisesRegex(RuntimeError, "active Anycubic MQTT connection"):
            await coordinator.button_press_event(1, "request_ace_info")
        self.assertEqual(online_ace.multi_color_box_request_info.await_count, 3)

    def make_printer(self, model, boxes):
        api = API()
        api._send_anycubic_order = AsyncMock(return_value="accepted")
        printer = AnycubicPrinter(api_parent=api, machine_type=model, machine_name="Test printer",
                                 id=1, multi_color_box=boxes)
        return printer, api._send_anycubic_order

    def payload(self, send):
        return send.await_args.kwargs["order_request"].order_request_data

    async def test_refill_targets_the_selected_ace_and_skips_the_kobra_x_rack(self):
        for model in (20029, 20030):
            rack = [{**ace(-1), "auto_feed": 0}] if model == 20030 else []
            boxes = rack + [{**ace(0), "auto_feed": 1}, {**ace(1), "auto_feed": 1}]
            printer, send = self.make_printer(model, boxes)
            for box_id, argument in ((0, -1), (1, 1)):
                with self.subTest(model=model, box=box_id):
                    for expected, toggle in (
                        (0, printer.multi_color_box_switch_off_auto_feed),
                        (1, printer.multi_color_box_switch_on_auto_feed),
                    ):
                        send.reset_mock()
                        await toggle(box_id=argument)
                        send.assert_awaited_once()
                        payload = self.payload(send)
                        self.assertEqual(payload["order_id"], AnycubicOrderID.MULTI_COLOR_BOX_AUTO_FEED)
                        self.assertEqual(payload["data"]["multi_color_box"], [
                            {"id": box_id, "auto_feed": expected},
                        ])
            if rack:
                self.assertEqual(printer.kobra_x_internal_material_rack.auto_feed, 0)

    async def test_presets_and_stops_reach_only_the_selected_ace_across_models(self):
        ns = methods("coordinator.py", "AnycubicCloudDataUpdateCoordinator", {"button_press_event"}, {
            "ENTITY_ID_DRYING_START_PRESET_": "drying_start_preset_", "AnycubicAPIError": AnycubicAPIError,
            "HomeAssistantError": RuntimeError,
            "get_drying_preset_from_entry_options": lambda options, index: options.get(index, (None, None)),
        })
        for model in (20021, 20024, 20029, 20030, 99999):
            boxes = ([ace(-1)] if model == 20030 else []) + [ace(0), ace(1)]
            printer, send = self.make_printer(model, boxes)
            host = SimpleNamespace(get_printer_for_id=lambda _: printer,
                                   entry=SimpleNamespace(options={"1": (600, 50), "4": (120, 45)}),
                                   _connect_mqtt_for_action_response=AsyncMock(), force_state_update=AsyncMock())
            original = copy.deepcopy(printer.primary_multi_color_box_spool_info_object)
            for prefix, box_id in (("", 0), ("secondary_", 1)):
                for index, duration, temperature in ((1, 600, 50), (4, 120, 45)):
                    with self.subTest(model=model, box=box_id, preset=index):
                        send.reset_mock()
                        await ns["button_press_event"](host, 1, f"{prefix}drying_start_preset_{index}")
                        send.assert_awaited_once()
                        data = self.payload(send)
                        self.assertEqual(data["order_id"], AnycubicOrderID.MULTI_COLOR_BOX_DRY)
                        self.assertEqual(data["data"]["multi_color_box"], [{"id": box_id, "drying_status": {
                            "status": 1, "duration": duration, "target_temp": temperature, "remain_time": None}}])
                send.reset_mock()
                await ns["button_press_event"](host, 1, f"{prefix}drying_stop")
                send.assert_awaited_once()
                self.assertEqual(self.payload(send)["data"]["multi_color_box"], [{"id": box_id, "drying_status": {
                    "status": 0, "duration": 0, "target_temp": 40, "remain_time": None}}])
            send.reset_mock()
            await ns["button_press_event"](host, 1, "drying_start_preset_2")
            send.assert_not_awaited()
            self.assertEqual(printer.primary_multi_color_box_spool_info_object, original)

    async def test_single_ace_start_defaults_and_stop_all_remain_compatible(self):
        for model in (20021, 20024, 20029, 20030):
            for count in (1, 2):
                with self.subTest(model=model, count=count):
                    boxes = ([ace(-1)] if model == 20030 else []) + [ace(i) for i in range(count)]
                    printer, send = self.make_printer(model, boxes)
                    await printer.multi_color_box_drying_start(120, 45)
                    self.assertEqual(self.payload(send)["data"]["multi_color_box"][0]["id"], 0)
                    await printer.multi_color_box_drying_stop()
                    self.assertEqual([box["id"] for box in self.payload(send)["data"]["multi_color_box"]], list(range(count)))

    async def test_no_ace_or_kobra_x_rack_only_sends_no_drying_order(self):
        for model, boxes in ((20021, None), (20029, []), (20030, [ace(-1)])):
            with self.subTest(model=model):
                printer, send = self.make_printer(model, boxes)
                await printer.multi_color_box_drying_start(120, 45)
                await printer.multi_color_box_drying_stop()
                send.assert_not_awaited()


if __name__ == "__main__":
    unittest.main()
