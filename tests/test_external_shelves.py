"""Regression coverage for optional external-holder data from the cloud."""
from __future__ import annotations

import contextlib
import io
import sys
import unittest
from pathlib import Path

INTEGRATION_ROOT = Path(__file__).resolve().parents[1] / "custom_components/anycubic_ha_integration"
sys.path.insert(0, str(INTEGRATION_ROOT))

from anycubic_cloud_api.data_models.printer import AnycubicPrinter  # noqa: E402
from anycubic_cloud_api.data_models.printer_properties import AnycubicMachineExternalShelves  # noqa: E402


class ExternalShelvesTests(unittest.TestCase):
    @staticmethod
    def shelf(**overrides):
        data = {"id": 1, "type": "PLA", "color": [1, 2, 3], "loaded": 1,
                "status_type": 1, "current_status": 5}
        return {**data, **overrides}

    @staticmethod
    def printer_info(shelves):
        # Synthetic cloud response: no credentials or real device identifiers.
        return {"id": 1, "name": "Test Printer", "key": "synthetic-key",
                "machine_type": 20030, "model": "Test Model", "device_status": 0,
                "is_printing": 1, "img": None, "type_function_ids": [], "version": None,
                "external_shelves": shelves}

    def test_unassigned_holder_does_not_prevent_printer_setup_or_updates(self):
        for shelves in (None, self.shelf(id=None, loaded=None),
                        {key: value for key, value in self.shelf().items() if key != "id"}):
            with self.subTest(shelves=shelves):
                data = self.printer_info(shelves)
                printer = AnycubicPrinter.from_info_json(object(), data)
                self.assertFalse(printer.initialisation_error)
                self.assertIsNone(printer.external_shelves)
                self.assertIsNone(printer.external_material_rack_spool_info_object)
                printer.update_from_info_json(data)
                self.assertFalse(printer.initialisation_error)

    def test_null_optional_states_use_same_unloaded_defaults_as_missing_states(self):
        nulls = self.shelf(loaded=None, status_type=None, current_status=None)
        missing = {key: value for key, value in nulls.items()
                   if key not in ("loaded", "status_type", "current_status")}
        for data in (nulls, missing):
            with self.subTest(data=data):
                printer = AnycubicPrinter.from_info_json(object(), self.printer_info(data))
                self.assertFalse(printer.initialisation_error)
                spool = printer.external_material_rack_spool_info_object[0]
                self.assertFalse(spool["spool_loaded"])
                self.assertEqual(spool["status"], 0)
                self.assertEqual(spool["material_type"], "PLA")

    def test_zero_id_and_loaded_spool_keep_existing_card_mapping(self):
        shelf = AnycubicMachineExternalShelves.from_json(self.shelf(id=0))
        self.assertIsNotNone(shelf)
        spool = shelf.spool_info_object[0]
        self.assertTrue(spool["spool_loaded"])
        self.assertEqual(spool["status"], 5)
        self.assertEqual(spool["color"], [1, 2, 3])
        self.assertEqual(spool["slot"], 1)
        self.assertEqual(spool["box_id"], -1)

    def test_mqtt_updates_handle_null_states_and_preserve_omitted_states(self):
        shelf = AnycubicMachineExternalShelves.from_json(self.shelf())
        shelf.update_with_mqtt_data({"type": "PETG", "color": [4, 5, 6]})
        self.assertTrue(shelf.spool_info_object[0]["spool_loaded"])
        self.assertEqual(shelf.spool_info_object[0]["status"], 5)
        shelf.update_with_mqtt_data(self.shelf(loaded=None, status_type=None, current_status=None))
        self.assertFalse(shelf.spool_info_object[0]["spool_loaded"])
        self.assertEqual(shelf.spool_info_object[0]["status"], 0)

    def test_invalid_present_fields_still_fail_without_printing_private_response(self):
        output = io.StringIO()
        data = self.printer_info(self.shelf(id="invalid-id"))
        with contextlib.redirect_stdout(output), self.assertRaises(ValueError):
            AnycubicPrinter.from_info_json(object(), data)
        self.assertEqual(output.getvalue(), "")


if __name__ == "__main__":
    unittest.main()
