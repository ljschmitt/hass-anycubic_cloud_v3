"""Elapsed-time normalization at the cloud/MQTT -> HA sensor boundary."""
from __future__ import annotations

import ast
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

INTEGRATION_ROOT = Path(__file__).resolve().parents[1] / "custom_components/anycubic_ha_integration"
sys.path.insert(0, str(INTEGRATION_ROOT))

from anycubic_cloud_api.data_models.consumable import AnycubicConsumableData  # noqa: E402
from anycubic_cloud_api.data_models.printer import AnycubicPrinter  # noqa: E402
from anycubic_cloud_api.data_models.project import AnycubicProject  # noqa: E402

# Reuse the real coordinator-method harness; only the HA runtime is stubbed.
from test_loaded_slot import build_sensor_data  # noqa: E402


def cloud_project(model=20029, elapsed=2601, remaining=224, **changes):
    # Synthetic project-list payload, not a user's diagnostic or print history.
    data = dict.fromkeys("""
        user_id model img material material_type pause connect_status reason
        slice_data slice_status ischeck project_type printed start_time end_time
        slice_start_time slice_end_time slice_param delete auto_operation monitor
        last_update_time localtask source device_message signal_strength key type
        printer_name machine_name device_status slice_result post_title
    """.split())
    data.update(id=1, taskid=1, printer_id=1, gcode_id=1, estimate=17520, progress=15,
                status=1, print_status=1, create_time=1700000000, gcode_name="test.gcode",
                total_time="4hour52min", settings={}, machine_type=model,
                print_time=elapsed, remain_time=remaining)
    data.update(changes)
    return AnycubicProject.from_list_json(object(), data)


def printer(model=20029, project=None):
    device = AnycubicPrinter(api_parent=object(), id=1, machine_type=model,
                             machine_name="Synthetic Printer")
    device._latest_project = project
    return device


def mqtt(device, elapsed=None, remaining=None, action="start", state="printing"):
    data = {"taskid": 1}
    if elapsed is not None:
        data["print_time"] = elapsed
    if remaining is not None:
        data["remain_time"] = remaining
    device.process_mqtt_update("anycubic/test/print/report", AnycubicConsumableData(
        {"type": "print", "action": action, "state": state, "data": data}))


class PrintTimeUnitTests(unittest.TestCase):
    def test_issue_17_cloud_seconds_become_fractional_minutes_in_sensor(self):
        project = cloud_project(elapsed="2601", remaining="224", model="20029")
        device = printer(project=project)
        with patch("anycubic_cloud_api.data_models.project.time.time", return_value=1700001000):
            sensors = build_sensor_data(device)["states"]
        self.assertEqual(project.print_time_elapsed_minutes, 43.35)
        self.assertEqual(sensors["job_time_elapsed"], 43.35)
        self.assertEqual(sensors["job_time_remaining"], 224)
        self.assertEqual(sensors["job_eta"], 1700014440)
        self.assertEqual(sensors["job_name"], "test")
        self.assertEqual(sensors["job_progress"], 15)
        self.assertEqual(project.created_timestamp, 1700000000)
        self.assertEqual(project.print_total_time_minutes, 292)
        self.assertEqual(project._print_time, 2601)

    def test_other_models_keep_minutes_including_long_prints_and_unknown_models(self):
        for model in (20021, 20022, 20023, 20024, 20025, 20026, 20027, 20028, 20030, 99999, None):
            for elapsed in (0, 43, 2601, 4320, None):
                with self.subTest(model=model, elapsed=elapsed):
                    project = cloud_project(model=model, elapsed=elapsed)
                    device = printer(model=model, project=project)
                    self.assertEqual(project.print_time_elapsed_minutes, elapsed)
                    self.assertEqual(device.latest_project_print_time_elapsed_minutes, elapsed)
                    self.assertEqual(build_sensor_data(device)["states"]["job_time_elapsed"], elapsed)
                    self.assertEqual(device.latest_project_print_time_remaining_minutes, 224)

    def test_printer_identity_is_authoritative_when_project_model_is_absent_or_wrong(self):
        for project_model in (None, 20024):
            with self.subTest(project_model=project_model):
                device = printer(project=cloud_project(model=project_model))
                self.assertEqual(device.latest_project_print_time_elapsed_minutes, 43.35)
        device = printer(model=20024, project=cloud_project(model=20029, elapsed=43))
        self.assertEqual(device.latest_project_print_time_elapsed_minutes, 43)

    def test_missing_project_missing_time_zero_short_and_multiday_durations(self):
        self.assertIsNone(printer().latest_project_print_time_elapsed_minutes)
        for raw, expected in ((None, None), (0, 0), (1, 1 / 60), (59, 59 / 60), (60, 1),
                              (2601, 43.35), (172801, 172801 / 60)):
            with self.subTest(raw=raw):
                device = printer(project=cloud_project(elapsed=raw))
                self.assertEqual(device.latest_project_print_time_elapsed_minutes, expected)
                self.assertEqual(device.latest_project_print_time_remaining_minutes, 224)

    def test_mqtt_partial_lifecycle_updates_normalize_only_s1_max_elapsed(self):
        lifecycle = (("start", "printing"), ("start", "updated"), ("update", "updated"),
                     ("pause", "paused"), ("resume", "resumed"), ("start", "finished"))
        for model in (20029, 20025, 20024, 20030, 99999):
            with self.subTest(model=model):
                project = cloud_project(model=model)
                device = printer(model=model, project=project)
                for action, state in lifecycle:
                    mqtt(device, elapsed="2701", remaining="223", action=action, state=state)
                    expected = 2701 / 60 if model == 20029 else 2701
                    self.assertEqual(build_sensor_data(device)["states"]["job_time_elapsed"], expected)
                    self.assertEqual(project._print_time, 2701)
                    self.assertEqual(device.latest_project_print_time_remaining_minutes, 223)
                mqtt(device, remaining=222)
                self.assertEqual(device.latest_project_print_time_elapsed_minutes, expected)
                mqtt(device, elapsed=2761)
                self.assertEqual(device.latest_project_print_time_remaining_minutes, 222)

    def test_polling_after_mqtt_and_repeated_reads_do_not_double_convert(self):
        for model in (20029, 20025, 20030):
            with self.subTest(model=model):
                project = cloud_project(model=model)
                device = printer(model=model, project=project)
                mqtt(device, elapsed=2701, remaining=223)
                update = cloud_project(model=model, elapsed=2801, remaining=222)
                for _ in range(3):
                    self.assertTrue(project.update_with_project(update))
                    for _ in range(3):
                        self.assertEqual(device.latest_project_print_time_elapsed_minutes,
                                         2801 / 60 if model == 20029 else 2801)
                    self.assertEqual(project._print_time, 2801)
                    self.assertEqual(update._print_time, 2801)
                    self.assertEqual(project.print_time_remaining_minutes, 222)

    def test_completion_timestamp_remaining_and_unknown_eta_are_unchanged(self):
        project = cloud_project(elapsed=2601, remaining=224, end_time=1700020000)
        self.assertEqual(project.print_approximate_completion_time, 1700020000)
        self.assertEqual(project.finished_timestamp, 1700020000)
        project = cloud_project(elapsed=2601, remaining=None)
        self.assertIsNone(project.print_time_remaining_minutes)
        self.assertEqual(project.print_approximate_completion_time, 0)

    def test_complete_coordinator_payload_changes_only_elapsed_time(self):
        device = printer(project=cloud_project())
        with patch("anycubic_cloud_api.data_models.project.time.time", return_value=1700001000):
            corrected = build_sensor_data(device)
            with patch.object(AnycubicProject, "get_print_time_elapsed_minutes",
                              lambda project, machine_type=None: project._print_time):
                previous = build_sensor_data(device)
        self.assertEqual(corrected["states"]["job_time_elapsed"], 43.35)
        corrected["states"]["job_time_elapsed"] = 2601
        self.assertEqual(corrected, previous)

    def test_ha_sensor_ids_and_minute_units_remain_compatible_with_existing_cards(self):
        tree = ast.parse((INTEGRATION_ROOT / "sensor.py").read_text(encoding="utf-8"))
        units = {}
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                args = {kw.arg: kw.value for kw in node.keywords}
                key = args.get("key")
                if isinstance(key, ast.Constant) and key.value in ("job_time_elapsed", "job_time_remaining"):
                    units[key.value] = ast.unparse(args["native_unit_of_measurement"])
        self.assertEqual(units, {"job_time_elapsed": "UnitOfTime.MINUTES", "job_time_remaining": "UnitOfTime.MINUTES"})


if __name__ == "__main__":
    unittest.main()
