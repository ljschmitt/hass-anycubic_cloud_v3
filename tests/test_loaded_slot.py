"""Regression tests for additive primary-ACE loaded-slot reporting."""
from __future__ import annotations

import ast
import copy
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from typing import Any

INTEGRATION_ROOT = Path(__file__).resolve().parents[1] / "custom_components/anycubic_ha_integration"
sys.path.insert(0, str(INTEGRATION_ROOT))

from anycubic_cloud_api.data_models.consumable import AnycubicConsumableData  # noqa: E402
from anycubic_cloud_api.data_models.printer import AnycubicPrinter  # noqa: E402


def ace(box_id=0, loaded_slot=1):
    return {"id": box_id, "status": 1, "model_id": 1, "auto_feed": 0, "loaded_slot": loaded_slot,
            "feed_status": None, "temp": 25, "drying_status": None, "curr_nozzle_temp": None,
            "target_nozzle_temp": None, "slots": [
                {"index": index, "sku": "", "type": "PLA", "color": [index + 1, 2, 3],
                 "edit_status": 0, "status": 5} for index in range(4)]}


def printer(boxes=None, machine_type=20024):
    return AnycubicPrinter(api_parent=object(), machine_type=machine_type,
                          machine_name="Test Printer", id=1, multi_color_box=boxes)


def mqtt_slot(printer_object, box_id, loaded_slot, action="autoUpdateInfo"):
    data = {"id": box_id, "loaded_slot": loaded_slot}
    if action == "feedFilament":
        data = {"multi_color_box": [{**data, "feed_status": None}]}
    printer_object.process_mqtt_update("anycubic/test/multiColorBox/report", AnycubicConsumableData(
        {"type": "multiColorBox", "action": action, "state": "done", "data": data}))


def build_sensor_data(printer_object):
    # Compile the actual coordinator method, stubbing only the HA runtime boundary.
    tree = ast.parse((INTEGRATION_ROOT / "coordinator.py").read_text(encoding="utf-8"))
    coordinator = next(node for node in tree.body if isinstance(node, ast.ClassDef)
                       and node.name == "AnycubicCloudDataUpdateCoordinator")
    method = next(node for node in coordinator.body if isinstance(node, ast.FunctionDef)
                  and node.name == "_build_printer_dict")
    namespace = {"Any": Any, "AnycubicPrinter": AnycubicPrinter,
                 "state_string_active": lambda value: "active" if value is not None else "inactive",
                 "state_string_loaded": lambda value: "loaded" if value is not None else "not loaded",
                 "MAX_DRYING_PRESETS": 1, "ENTITY_ID_DRYING_START_PRESET_": "drying_start_preset_",
                 "get_drying_preset_from_entry_options": lambda options, index: (30, 45)}
    exec(compile(ast.Module(body=[method], type_ignores=[]), "coordinator.py", "exec"), namespace)
    host = SimpleNamespace(_cloud_file_list=None, _mqtt_manually_connected=False,
                           entry=SimpleNamespace(options={}), anycubic_api=SimpleNamespace(
                               mqtt_is_started=False, anycubic_auth=SimpleNamespace(supports_mqtt_login=True)))
    return namespace["_build_printer_dict"](host, printer_object)


class LoadedSlotTests(unittest.TestCase):
    def test_cloud_value_is_zero_based_and_preserves_no_slot_sentinel(self):
        for value in (0, 1, 3, -1):
            with self.subTest(value=value):
                data = ace(loaded_slot=value)
                original = copy.deepcopy(data)
                device = printer([data])
                self.assertEqual(device.primary_multi_color_box_loaded_slot, value)
                self.assertEqual(data, original)
                self.assertEqual([s["local_slot"] for s in device.primary_multi_color_box_spool_info_object], [1, 2, 3, 4])

    def test_no_ace_and_rack_only_return_none(self):
        for device in (printer(), printer([]), printer([ace(-1, 2)], machine_type=20030)):
            with self.subTest(device=device.machine_type):
                self.assertIsNone(device.primary_multi_color_box_loaded_slot)
                self.assertIsNone(device.primary_multi_color_box_spool_info_object)
                result = build_sensor_data(device)
                self.assertIsNone(result["attributes"]["ace_spools"]["loaded_slot"])

    def test_secondary_mqtt_update_does_not_change_primary_or_existing_spool_data(self):
        device = printer([ace(0, 1), ace(1, 3)])
        original = copy.deepcopy(build_sensor_data(device))
        mqtt_slot(device, 1, 0)
        self.assertEqual(device.primary_multi_color_box_loaded_slot, 1)
        self.assertEqual(device.secondary_multi_color_box.loaded_slot, 0)
        self.assertEqual(build_sensor_data(device), original)

    def test_kobra_x_skips_internal_rack_and_keeps_display_and_print_mappings(self):
        device = printer([ace(-1, 2), ace(0, 1), ace(1, 3)], machine_type=20030)
        self.assertEqual(device.primary_multi_color_box_loaded_slot, 1)
        self.assertEqual(device.kobra_x_internal_material_rack.loaded_slot, 2)
        self.assertEqual(device.secondary_multi_color_box.loaded_slot, 3)
        self.assertEqual([s["display_slot"] for s in device.primary_multi_color_box_spool_info_object], [4, 5, 6, 7])
        self.assertEqual([s["display_slot"] for s in device.secondary_multi_color_box_spool_info_object], [8, 9, 10, 11])
        self.assertTrue(device.kobra_x_internal_material_rack_spool_info_object[3]["reserved_by_ace"])
        self.assertEqual(device.print_slot_numbers_to_indices([1, 5, 9]), [-4, 1, 5])

    def test_mqtt_updates_only_the_new_attribute_and_preserves_cached_offline_data(self):
        device = printer([ace()])
        original = build_sensor_data(device)
        for value, action in ((3, "autoUpdateInfo"), (0, "feedFilament"), (-1, "autoUpdateInfo")):
            with self.subTest(value=value, action=action):
                mqtt_slot(device, 0, value, action)
                current = build_sensor_data(device)
                self.assertEqual(current["attributes"]["ace_spools"]["loaded_slot"], value)
                current["attributes"]["ace_spools"]["loaded_slot"] = 1
                self.assertEqual(current, original)
        mqtt_slot(device, 99, 2)
        self.assertEqual(device.primary_multi_color_box_loaded_slot, -1)
        self.assertFalse(device.printer_online)


if __name__ == "__main__":
    unittest.main()
