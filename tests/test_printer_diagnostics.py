"""Prove that a firmware capture is scoped, bounded and safe to share."""
from __future__ import annotations

import json
import unittest
from unittest.mock import patch

import test_loaded_slot

# isort: split
from anycubic_cloud_api.printer_capture import PrinterCapture, printer_metadata


class PrinterDiagnosticsTests(unittest.TestCase):
    def test_only_selected_printer_and_filtered_fields_are_exported(self):
        capture = PrinterCapture()
        capture.start(1)
        capture.record(2, "mqtt", "printer_report", {"otherPrinter": 2})
        capture.record(1, "mqtt", "printer_report", {
            "type": "properties",
            "action": "report",
            "state": "arbitraryFreeText",
            "data": {
                "humidity": 47.5,
                "newFanMode": 3,
                "temperatures": [{"temp": "23.5"}],
                "note": "my custom printer name",
                "accessToken": "private-value",
                "printerId": 12345,
                "machineMac": "sensitive-address",
                "project": {"humidity": 300},
                "192.168." + "1.123": {"humidity": 700},
            },
        })
        capture.record(1, "cloud", "printer_properties", {
            "data": {"humidity": {"value": 48}, "device_state": {"value": 0}},
        })
        report = capture.export(1)
        self.assertIsNone(capture.export(2))
        self.assertEqual(report["received"], {"mqtt": 1, "cloud": 1})
        mqtt = report["samples"]["mqtt"][0]["fields"]
        cloud = report["samples"]["cloud"][0]["fields"]
        self.assertEqual(mqtt["data.humidity"], {"type": "float", "value": 47.5})
        self.assertEqual(mqtt["data.newFanMode"], {"type": "int"})
        self.assertEqual(mqtt["data.temperatures.0.temp"], {"type": "str", "value": "23.5"})
        self.assertEqual(mqtt["state"], {"type": "str"})
        self.assertEqual(cloud["data.humidity.value"], {"type": "int", "value": 48})
        self.assertEqual(cloud["data.device_state.value"], {"type": "int", "value": 0})
        public = json.dumps(report)
        for private in ("private-value", "12345", "sensitive-address", "my custom", "arbitraryFreeText",
                        "otherPrinter", "accessToken", "machineMac", "192.168.", "project"):
            self.assertNotIn(private, public)

    def test_capture_expires_and_mqtt_volume_does_not_evict_cloud_samples(self):
        capture = PrinterCapture()
        with patch("anycubic_cloud_api.printer_capture.time.monotonic", return_value=100) as clock:
            capture.start(1)
            capture.record(1, "cloud", "printer_info", {"data": {"humidity": 43}})
            for temperature in range(100):
                capture.record(1, "mqtt", "printer_report", {"data": {"temp": temperature}})
            capture.record(1, "mqtt", "printer_report", {"data": {"temp": 99}})
            report = capture.export(1)
            self.assertEqual(report["received"], {"mqtt": 101, "cloud": 1})
            self.assertEqual(len(report["samples"]["mqtt"]), 80)
            self.assertEqual(len(report["samples"]["cloud"]), 1)
            self.assertEqual(report["samples"]["mqtt"][0]["fields"]["data.temp"]["value"], 20)
            clock.return_value = 400
            capture.record(1, "mqtt", "printer_report", {"data": {"temp": 100}})
            self.assertFalse(capture.export(1)["recording"])
            self.assertEqual(capture.export(1)["received"]["mqtt"], 101)
            clock.return_value = 1900
            self.assertIsNone(capture.export(1))
            capture.start(2)
            self.assertIsNone(capture.export(1))
            self.assertEqual(capture.export(2)["received"], {"mqtt": 0, "cloud": 0})

    def test_metadata_does_not_copy_custom_device_names(self):
        self.assertEqual(printer_metadata(20030, "v2.0.2.8"), {"model_code": "20030", "firmware": "v2.0.2.8"})
        self.assertEqual(printer_metadata("My printer", "custom"), {"model_code": None, "firmware": None})

    def test_cloud_capture_keeps_later_fields_in_larger_printer_details(self):
        capture = PrinterCapture()
        capture.start(1)
        payload = {"data": {**{f"field{i}": i for i in range(230)}, "humidity": 45}}
        capture.record(1, "cloud", "printer_info", payload)
        capture.record(1, "mqtt", "printer_report", payload)
        samples = capture.export(1)["samples"]
        self.assertEqual(samples["cloud"][0]["fields"]["data.humidity"], {"type": "int", "value": 45})
        self.assertLess(len(samples["mqtt"][0]["fields"]), len(samples["cloud"][0]["fields"]))
