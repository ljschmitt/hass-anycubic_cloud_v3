"""Synthetic replays of #10 and observed firmware reports, with no cloud access."""
from __future__ import annotations

import copy
import unittest

from anycubic_cloud_api.const.enums import AnycubicPrintStatus
from anycubic_cloud_api.data_models.consumable import AnycubicConsumableData
from anycubic_cloud_api.exceptions.exceptions import (
    AnycubicAPIError,
    AnycubicMQTTUnhandledData,
    AnycubicMQTTUnknownUpdate,
)
from test_loaded_slot import ace
from test_print_time_units import cloud_project, printer

PHASES = (
    "nozzle_purging", "nozzle_heating", "nozzle_cooling", "nozzle_cooling_off", "nozzle_wiping",
    "hotbed_heating", "hotbed_cooling_off", "z_offset_calibrating", "frequency_sweeping",
    "extfilbox_filament_feeding",
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
        for pause in (0, 1):
            for phase in PHASES:
                with self.subTest(pause=pause, phase=phase):
                    device = printer(project=cloud_project(pause=pause))
                    report(device, "print", "start", phase, {"taskid": 1})
                    self.assertEqual(device.latest_project.raw_print_status, AnycubicPrintStatus.Printing)
                    self.assertEqual(device.latest_project.print_is_paused, bool(pause))

    def test_late_cooling_cannot_revive_completed_or_cancelled_jobs(self):
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
