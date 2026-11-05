"""Synthetic replays of #10 and observed firmware reports, with no cloud access."""
from __future__ import annotations

import copy
import unittest
from unittest.mock import patch

from anycubic_cloud_api.const.enums import AnycubicPrintStatus
from anycubic_cloud_api.data_models.consumable import AnycubicConsumableData
from anycubic_cloud_api.exceptions.exceptions import (
    AnycubicAPIError,
    AnycubicMQTTUnhandledData,
    AnycubicMQTTUnknownUpdate,
)
from test_loaded_slot import ace, build_sensor_data
from test_print_time_units import cloud_project, printer

PHASES = (
    "nozzle_purging", "nozzle_heating", "nozzle_cooling", "nozzle_cooling_off", "nozzle_wiping",
    "hotbed_heating", "hotbed_cooling_off", "auto_leveling", "z_offset_calibrating",
    "frequency_sweeping", "filament_cutting", "extfilbox_filament_feeding", "extfilbox_filament_unfeeding",
    "ace_filament_feeding", "ace_filament_unfeeding",
)


def report(device, kind, action, state, data, code=200):
    device.process_mqtt_update(f"anycubic/test/{kind}/report", AnycubicConsumableData({
        "type": kind, "action": action, "state": state, "data": data,
        "code": code, "msg": "test", "msgid": "test", "timestamp": 0,
    }))


class FirmwareMQTTTests(unittest.TestCase):
    def test_preparation_phases_remain_active_without_inventing_completion(self):
        for model in (20021, 20024, 20029, 20030, 99999):
            for phase in PHASES:
                with self.subTest(model=model, phase=phase):
                    device = printer(model, cloud_project(model=model, print_status=AnycubicPrintStatus.Checking))
                    report(device, "print", "start", phase, {"taskid": "1", "channel_no": 4, "target_temp": 50})
                    self.assertEqual(device.latest_project.raw_print_status, AnycubicPrintStatus.Preheating)
                    self.assertTrue(device.latest_project_print_in_progress)
                    self.assertFalse(device.latest_project_print_complete)
                    self.assertEqual(device.latest_project_progress_percentage, 15)
                    self.assertEqual(device.latest_project_print_time_remaining_minutes, 224)

    def test_printing_and_pause_are_preserved_during_subphases(self):
        for pause in (None, 0, 1):
            for phase in PHASES:
                with self.subTest(pause=pause, phase=phase):
                    device = printer(project=cloud_project(pause=pause))
                    report(device, "print", "start", phase, {"taskid": 1})
                    self.assertEqual(device.latest_project.raw_print_status, AnycubicPrintStatus.Printing)
                    self.assertEqual(device.latest_project.print_is_paused, bool(pause))

    def test_kobra_x_auto_leveling_accepts_full_and_partial_reports(self):
        device = printer(model=20030, project=cloud_project(
            model=20030, print_status=AnycubicPrintStatus.Checking, progress=0,
        ))
        partial = {
            "taskid": 1, "progress": 0, "filename": "test.gcode",
            "file_root_path": "test.gcode.3mf", "filetype": 0,
        }
        full = {
            **partial, "curr_layer": 0, "total_layers": 0, "print_time": 0,
            "remain_time": 0, "supplies_usage": 0,
        }

        for data in (full, partial):
            report(device, "print", "start", "auto_leveling", data)
            self.assertTrue(device.latest_project_print_in_progress)
            self.assertEqual(device.latest_project.raw_print_status, AnycubicPrintStatus.Preheating)
        report(device, "print", "update", "updated", {"taskid": 1, "curr_layer": 1, "progress": 2})
        self.assertEqual(device.latest_project.raw_print_status, AnycubicPrintStatus.Printing)
        self.assertEqual(device.latest_project_progress_percentage, 2)

    def test_cloud_leveling_keeps_the_job_active(self):
        device = printer(model=20030, project=cloud_project(
            model=20030, print_status=AnycubicPrintStatus.Leveling,
        ))
        self.assertEqual(device.latest_project.print_status, "leveling")
        self.assertTrue(device.latest_project_print_in_progress)

    def test_kobra_x_cloud_preparation_preserves_raw_codes(self):
        for code in (19, 27, 29, 30):
            with self.subTest(code=code):
                device = printer(model=20030, project=cloud_project(print_status=code, progress=0))
                device._device_status = 1
                device._is_printing = 2
                self.assertEqual(device.latest_project_raw_print_status, code)
                self.assertEqual(device.latest_project_print_status, "preheating")
                self.assertTrue(device.latest_project_print_in_progress)

    def test_unverified_cloud_statuses_remain_unknown(self):
        for model, busy, code, progress in (
            (20029, True, 19, 0), (20030, False, 19, 0),
            (20030, True, 999, 0), (20030, True, 27, 15), (20030, True, 26, 100),
        ):
            with self.subTest(model=model, busy=busy, code=code, progress=progress):
                device = printer(model=model, project=cloud_project(print_status=code, progress=progress))
                device._device_status = 1
                device._is_printing = 2 if busy else 1
                self.assertEqual(device.latest_project_print_status, "unknown")
                self.assertFalse(device.latest_project_print_in_progress)

    def test_kobra_x_filament_change_preserves_active_print(self):
        for code in (19, 26):
            with self.subTest(code=code):
                device = printer(model=20030, project=cloud_project(print_status=code, progress=13))
                device._device_status = 1
                device._is_printing = 2
                self.assertEqual(device.latest_project_print_status, "printing")
                self.assertTrue(device.latest_project_print_in_progress)
                for phase, fields in (
                    ("filament_cutting", {}),
                    ("extfilbox_filament_unfeeding", {"channel_no": 2}),
                    ("ace_filament_feeding", {"channel_no": 1, "unit_no": 1}),
                    ("ace_filament_unfeeding", {"channel_no": 1, "unit_no": 1}),
                ):
                    report(device, "print", "start", phase, {"taskid": 1, **fields})
                    self.assertEqual(device.latest_project_print_status, "printing")
                    self.assertEqual(device.latest_project_progress_percentage, 13)

    def test_late_preparation_cannot_revive_completed_or_cancelled_jobs(self):
        for status in (AnycubicPrintStatus.Complete, AnycubicPrintStatus.Cancelled):
            for taskid in (1, "1", -1):
                for phase in PHASES:
                    with self.subTest(status=status, taskid=taskid, phase=phase):
                        device = printer(project=cloud_project(print_status=status))
                        report(device, "print", "start", phase, {"taskid": taskid})
                        self.assertEqual(device.latest_project.raw_print_status, status)
                        self.assertFalse(device.latest_project_print_in_progress)
                        self.assertEqual(device._is_printing, 1)

    def test_a_different_task_does_not_overwrite_the_previous_project(self):
        device = printer(project=cloud_project(print_status=AnycubicPrintStatus.Complete))
        report(device, "print", "start", "nozzle_purging", {"taskid": 2})
        self.assertEqual(device.latest_project.raw_print_status, AnycubicPrintStatus.Complete)
        self.assertEqual(device._is_printing, 2)

    def test_explicit_finished_and_cancelled_reports_still_end_the_job(self):
        for end, expected in (("finished", AnycubicPrintStatus.Complete), ("stoped", AnycubicPrintStatus.Cancelled)):
            device = printer(project=cloud_project(print_status=AnycubicPrintStatus.Checking))
            report(device, "print", "start", "hotbed_cooling_off", {"taskid": 1})
            self.assertTrue(device.latest_project_print_in_progress)
            report(device, "print", "start", end, {"taskid": 1})
            self.assertEqual(device.latest_project.raw_print_status, expected)
            self.assertFalse(device.latest_project_print_in_progress)

    def test_fan_query_and_legacy_auto_use_the_existing_fields(self):
        device = printer()
        for action, value in (("query", 0), ("auto", 40), ("query", 75)):
            report(device, "fan", action, "done", {"fan_speed_pct": value})
            self.assertEqual(device._fan_speed, value)

    def test_modern_feed_path_reports_preserve_authoritative_material_and_slots(self):
        device = printer(model=20030)
        device._set_multi_color_box([ace(-1), ace(0), ace(1)])
        device._set_external_shelves({"id": 1, "type": "PLA", "color": [1, 2, 3],
                                     "loaded": 1, "status_type": 1, "current_status": 5})
        original = copy.deepcopy((device.external_material_rack_spool_info_object,
                                  device.primary_multi_color_box_spool_info_object,
                                  device.secondary_multi_color_box_spool_info_object))
        for action in ("auto", "getInfo"):
            report(device, "extfilbox", action, "done", {
                "ace_connect_type": 0, "auto_refill": 1, "current_filament": "0-3", "enable_clog_check": 0,
                "enable_runout_check": 1, "ext_spool": 0, "ext_spool_status": "ready", "ext_spool_type": "",
                "ext_spool_colors": [], "ext_spool_icon_type": 0, "flush_multiplier": 0.7, "type": "k4p",
            })
        report(device, "extrudeControl", "getInfo", "done", {"current_status": 0, "filament_color": [[1, 2, 3, 255]],
                                                               "has_filaments": 1, "index": 3, "laps": "0/0", "move_type": 0})
        self.assertEqual((device.external_material_rack_spool_info_object, device.primary_multi_color_box_spool_info_object,
                          device.secondary_multi_color_box_spool_info_object), original)
        report(device, "extfilbox", "reportInfo", "success", {"type": "PETG", "color": [3, 2, 1], "loaded": 1})
        self.assertEqual(device.external_material_rack_spool_info_object[0]["material_type"], "PETG")

    def test_feed_filament_without_optional_status_preserves_cached_status_and_other_ace(self):
        device = printer(model=20030)
        primary = ace(0)
        secondary = ace(1)
        secondary["feed_status"] = {"type": 1, "current_status": 2, "slot_index": 1}
        device._set_multi_color_box([ace(-1), primary, secondary])
        cached = device.secondary_multi_color_box._feed_status
        report(device, "multiColorBox", "feedFilament", "done", {"multi_color_box": [{"id": 1, "loaded_slot": 2}]})
        self.assertIs(device.secondary_multi_color_box._feed_status, cached)
        self.assertEqual(device.secondary_multi_color_box.loaded_slot, 2)
        self.assertEqual(device.primary_multi_color_box_loaded_slot, 1)

    def test_known_print_metadata_is_consumed_without_changing_timing_or_temperatures(self):
        device = printer(project=cloud_project())
        before = (device.latest_project_print_time_elapsed_minutes, device.latest_project_print_time_remaining_minutes)
        report(device, "print", "update", "updated", {"taskid": 1, "channel_no": 1, "unit_no": 1,
                                                       "target_temp": 205, "settings": {"light": 0},
                                                       "file_root_path": "test.gcode.3mf", "filetype": 0})
        self.assertEqual((device.latest_project_print_time_elapsed_minutes,
                          device.latest_project_print_time_remaining_minutes), before)

    def test_observed_properties_report_does_not_change_print_state(self):
        device = printer(model=20030, project=cloud_project(progress=48))
        properties = {
            "assistant_settings": [{"option": 0, "value": 1}],
            "hardware_settings": {"diameter": "0.4", "material": 2},
            "head_channel_count": 4,
            "hotbed_settings": {"material": 1},
            "option_settings": [{"option": 1, "value": 600}],
        }
        report(device, "properties", "report", "done", properties)
        self.assertEqual(device.latest_project_print_status, "printing")
        self.assertEqual(device.latest_project_progress_percentage, 48)
        with self.assertRaises(AnycubicMQTTUnhandledData):
            report(device, "properties", "report", "done", {
                **properties, "hardware_settings": {**properties["hardware_settings"], "future_field": 1},
            })

    def test_kobra_x_ace_drying_survives_empty_cloud_status(self):
        device = printer(model=20030)
        device._device_status = 1
        primary, secondary = ace(0), ace(1)
        primary["drying_status"] = {"status": 0, "duration": 0, "remain_time": 0, "target_temp": 0}
        secondary["drying_status"] = {"status": 1, "duration": 60, "remain_time": 45, "target_temp": 40}
        boxes = [ace(-1), primary, secondary]
        device._set_multi_color_box(boxes)
        start = {"status": 1, "target_temp": 50, "duration": 480, "remain_time": 480, "humidity": 0}
        with patch("anycubic_cloud_api.data_models.printer_properties.monotonic", return_value=100):
            report(device, "multiColorBox", "setDry", "success", {
                "multi_color_box": [{"id": 0, "drying_status": start}],
            })
            report(device, "multiColorBox", "autoUpdateDryStatus", "success", {
                "multi_color_box": [{"id": 0, "drying_status": {**start, "duration": 28800, "humidity": 33}}],
            })
            self.assertEqual(device.primary_multi_color_box_current_temperature, 25)
            device._set_multi_color_box(boxes)
            states = build_sensor_data(device)["states"]
            self.assertTrue(states["dry_status_is_drying"])
            self.assertEqual(states["dry_status_total_duration"], 480)
            self.assertEqual(states["dry_status_remaining_time"], 480)
            self.assertEqual(states["dry_status_target_temperature"], 50)
            self.assertEqual(states["secondary_dry_status_remaining_time"], 45)
            primary["drying_status"] = {**start, "duration": 28800, "remain_time": 475}
            device._set_multi_color_box(boxes)
            self.assertEqual(device.primary_drying_status_total_duration, 480)
            primary["drying_status"] = {"status": 0, "duration": 0, "remain_time": 0, "target_temp": 0}
            device._set_multi_color_box(boxes)

        with patch("anycubic_cloud_api.data_models.printer_properties.monotonic", return_value=160):
            self.assertEqual(device.primary_drying_status_remaining_time, 479)
            report(device, "multiColorBox", "setDry", "success", {
                "multi_color_box": [{"id": 0, "drying_status": {"humidity": 0, "status": 0}}],
            })
            self.assertEqual(device.primary_drying_status_raw_status_code, 0)
            device._set_multi_color_box(boxes)
            states = build_sensor_data(device)["states"]
            self.assertFalse(states["dry_status_is_drying"])
            self.assertEqual(states["dry_status_remaining_time"], 0)
            self.assertEqual(states["dry_status_target_temperature"], 0)
            self.assertTrue(device.secondary_drying_status_is_drying)

    def test_legacy_ace_drying_temperature_and_minutes_still_update(self):
        device = printer(model=20029)
        device._set_multi_color_box([ace()])
        report(device, "multiColorBox", "autoUpdateDryStatus", "success", {
            "multi_color_box": [{"id": 0, "temp": 46, "drying_status": {
                "status": 1, "duration": 480, "remain_time": 8, "target_temp": 50,
            }}],
        })
        self.assertEqual(device.primary_multi_color_box_current_temperature, 46)
        self.assertEqual(device.primary_drying_status_total_duration, 480)
        self.assertEqual(device.primary_drying_status_remaining_time, 8)

    def test_kobra_x_drying_periodic_report_without_start_expires(self):
        device = printer(model=20030)
        device._device_status = 1
        device._set_fw_version({"need_update": 0, "firmware_version": "2.0.2.2"})
        boxes = [ace(-1), ace(0)]
        boxes[1]["drying_status"] = {"status": 0}
        device._set_multi_color_box(boxes)
        with patch("anycubic_cloud_api.data_models.printer_properties.monotonic", return_value=100):
            report(device, "multiColorBox", "autoUpdateDryStatus", "success", {
                "multi_color_box": [{"id": 0, "drying_status": {
                    "status": 1, "duration": 28800, "remain_time": 474, "target_temp": 50, "humidity": 36,
                }}],
            })
            device._set_multi_color_box(boxes)
            self.assertEqual(device.primary_drying_status_total_duration, 480)
            self.assertEqual(device.primary_drying_status_remaining_time, 474)
        with patch("anycubic_cloud_api.data_models.printer_properties.monotonic", return_value=28540):
            self.assertFalse(device.primary_drying_status_is_drying)
            self.assertEqual(device.primary_drying_status_remaining_time, 0)

    def test_real_camera_failure_remains_an_error_and_unknown_data_stays_visible(self):
        device = printer()
        with self.assertRaisesRegex(AnycubicAPIError, "camera capture failed.*11410"):
            report(device, "video", "startCapture", "pushFailed", None, code=11410)
        with self.assertRaises(AnycubicMQTTUnknownUpdate):
            report(device, "print", "start", "future_unrecognized_state", {"taskid": 1})
        with self.assertRaises(AnycubicMQTTUnknownUpdate):
            report(device, "extrudeControl", "future_action", "done", {})
        with self.assertRaises(AnycubicMQTTUnhandledData):
            report(device, "extfilbox", "auto", "done", {"future_field": 1})


if __name__ == "__main__":
    unittest.main()
