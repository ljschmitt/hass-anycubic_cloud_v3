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

from anycubic_cloud_api.data_models.consumable import AnycubicConsumableData  # noqa: E402
from anycubic_cloud_api.data_models.printer import AnycubicPrinter  # noqa: E402


class StubAnycubicAPI:
    async def _send_order_list_local_files(
        self,
        printer: AnycubicPrinter,
        file_path: str = "/",
    ) -> None:
        del printer, file_path

    async def _send_order_list_udisk_files(
        self,
        printer: AnycubicPrinter,
        file_path: str = "/",
    ) -> None:
        del printer, file_path


class EmptyFileListTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.printer = AnycubicPrinter(
            api_parent=StubAnycubicAPI(),  # type: ignore[arg-type]
            machine_type=0,
            machine_name="Test Printer",
            id=1,
            ignore_init_errors=True,
        )

    async def test_empty_local_folder_without_records_is_loaded(self) -> None:
        await self.printer.request_local_file_list("/Empty Local")

        self.printer.process_mqtt_update(
            "anycubic/test/file/report",
            AnycubicConsumableData(
                {
                    "type": "file",
                    "action": "listLocal",
                    "state": "done",
                    "data": {"list_mode": 0},
                }
            ),
        )

        self.assertEqual(self.printer.local_file_list_path, "/Empty Local")
        self.assertEqual(self.printer.local_file_list_object, [])

    async def test_empty_udisk_folder_without_records_is_loaded(self) -> None:
        await self.printer.request_udisk_file_list("/Empty USB")

        self.printer.process_mqtt_update(
            "anycubic/test/file/report",
            AnycubicConsumableData(
                {
                    "type": "file",
                    "action": "listUdisk",
                    "state": "done",
                    "data": {"list_mode": 0},
                }
            ),
        )

        self.assertEqual(self.printer.udisk_file_list_path, "/Empty USB")
        self.assertEqual(self.printer.udisk_file_list_object, [])


if __name__ == "__main__":
    unittest.main()
