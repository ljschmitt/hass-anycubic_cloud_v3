from __future__ import annotations

import sys
import unittest
from pathlib import Path

INTEGRATION_ROOT = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "anycubic_ha_integration"
)
sys.path.insert(0, str(INTEGRATION_ROOT))

from anycubic_cloud_api.data_models.printer import AnycubicPrinter  # noqa: E402


class StubAnycubicAPI:
    pass


class PrintSlotMappingTests(unittest.TestCase):
    @staticmethod
    def _box(box_id: int, materials: list[str]) -> dict[str, object]:
        return {
            "id": box_id,
            "status": 1,
            "model_id": 1,
            "auto_feed": 0,
            "loaded_slot": 0,
            "feed_status": None,
            "temp": 25,
            "drying_status": None,
            "curr_nozzle_temp": None,
            "target_nozzle_temp": None,
            "slots": [
                {
                    "index": index,
                    "sku": "",
                    "type": material,
                    "color": [index + 10, index + 20, index + 30],
                    "edit_status": 0,
                    "status": 5,
                }
                for index, material in enumerate(materials)
            ],
        }

    def test_standard_printer_uses_consecutive_ace_indices(self) -> None:
        printer = AnycubicPrinter(
            api_parent=StubAnycubicAPI(),  # type: ignore[arg-type]
            machine_type=20024,
            machine_name="Test Printer",
            id=1,
            ignore_init_errors=True,
        )

        self.assertEqual(printer.print_slot_numbers_to_indices([1, 4, 5]), [0, 3, 4])

    def test_kobra_x_maps_rack_and_ace_accesses(self) -> None:
        printer = AnycubicPrinter(
            api_parent=StubAnycubicAPI(),  # type: ignore[arg-type]
            machine_type=20030,
            machine_name="Anycubic Kobra X",
            id=1,
            ignore_init_errors=True,
        )

        self.assertEqual(
            printer.print_slot_numbers_to_indices([1, 2, 3, 4, 5, 6, 7]),
            [-4, -3, -2, 0, 1, 2, 3],
        )

    def test_kobra_x_preserves_repeated_colour_assignments(self) -> None:
        printer = AnycubicPrinter(
            api_parent=StubAnycubicAPI(),  # type: ignore[arg-type]
            machine_type=20030,
            machine_name="Anycubic Kobra X",
            id=1,
            ignore_init_errors=True,
        )

        self.assertEqual(printer.print_slot_numbers_to_indices([5, 5, 2]), [1, 1, -3])

    def test_kobra_x_mapping_uses_material_from_selected_source(self) -> None:
        printer = AnycubicPrinter(
            api_parent=StubAnycubicAPI(),  # type: ignore[arg-type]
            machine_type=20030,
            machine_name="Anycubic Kobra X",
            id=1,
            multi_color_box=[
                self._box(-1, ["PETG", "TPU", "ABS", "FEED"]),
                self._box(0, ["PLA", "PLA SILK", "ASA", "PETG"]),
            ],
        )

        indices = printer.print_slot_numbers_to_indices([1, 5])
        mapping = printer._build_manual_ams_mapping(indices)

        self.assertIsNotNone(mapping)
        assert mapping is not None
        self.assertEqual(
            [item.as_box_mapping_data() for item in mapping],
            [
                {
                    "ams_color": [10, 20, 30],
                    "ams_index": -4,
                    "filament_used": 0.0,
                    "material_type": "PETG",
                    "paint_color": [10, 20, 30],
                    "paint_index": 0,
                },
                {
                    "ams_color": [11, 21, 31],
                    "ams_index": 1,
                    "filament_used": 0.0,
                    "material_type": "PLA SILK",
                    "paint_color": [11, 21, 31],
                    "paint_index": 1,
                },
            ],
        )


if __name__ == "__main__":
    unittest.main()
