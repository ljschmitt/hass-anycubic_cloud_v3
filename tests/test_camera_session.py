"""Exercise the Kobra 2 Max camera probe without contacting Anycubic."""
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

from test_ace_drying import methods

# isort: split
from anycubic_cloud_api.const.api_endpoints import API_ENDPOINT
from anycubic_cloud_api.const.enums import AnycubicOrderID
from anycubic_cloud_api.data_models.orders import AnycubicBaseOrderRequest, AnycubicCameraSession
from anycubic_cloud_api.exceptions.exceptions import AnycubicAPIParsingError

AGORA = {
    "appid": "test-app", "channel": "test-channel", "rtc_token": "test-session", "client_uid": 1,
    "encryption_kdf_salt": "test-salt", "encryption_key": "test-key", "encryption_mode": "aes-128-gcm2",
}
METHODS = {
    "get_camera_session", "_send_anycubic_camera_open_order",
    "_probe_kobra_2_max_camera", "_log_camera_probe",
}
namespace = methods("anycubic_cloud_api/api/functions.py", "AnycubicAPIFunctions", METHODS, {
    "API_ENDPOINT": API_ENDPOINT,
    "AnycubicOrderID": AnycubicOrderID,
    "AnycubicBaseOrderRequest": AnycubicBaseOrderRequest,
    "AnycubicCameraSession": AnycubicCameraSession,
    "AnycubicAPIParsingError": AnycubicAPIParsingError,
    "_AGORA_CAMERA_FIELDS": tuple(AGORA),
})
API = type("OfflineAPI", (), {name: namespace[name] for name in METHODS})


class CameraSessionTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.api = API()
        self.api._fetch_api_resp = AsyncMock()
        self.api._log_to_warn = Mock()

    async def test_legacy_order_runs_only_on_kobra_2_max(self):
        for model in (20021, 20023, 20024, 20030):
            with self.subTest(model=model):
                self.api._fetch_api_resp.reset_mock()
                self.api._fetch_api_resp.side_effect = [
                    {"code": 200, "data": {}},
                    {"code": 200, "data": {"token": {"tmpSecretKey": "never-log-this"}}},
                ]
                with self.assertRaises(AnycubicAPIParsingError):
                    await self.api.get_camera_session(SimpleNamespace(id=1, machine_type=model))
                requests = [call.kwargs["params"] for call in self.api._fetch_api_resp.await_args_list]
                self.assertTrue(requests[0]["shengwang_rtc_support"])
                if model == 20023:
                    self.assertEqual(requests[1:], [
                        {key: value for key, value in requests[0].items() if key != "shengwang_rtc_support"},
                    ])
                else:
                    self.assertEqual(len(requests), 1)
        log = str(self.api._log_to_warn.call_args_list)
        self.assertIn("tmpSecretKey", log)
        self.assertNotIn("never-log-this", log)

    async def test_existing_agora_response_is_returned_without_retry(self):
        self.api._fetch_api_resp.return_value = {"code": 200, "data": {"shengwang": AGORA}}
        for model in (20023, 20024, 20030):
            with self.subTest(model=model):
                self.api._fetch_api_resp.reset_mock()
                session = await self.api.get_camera_session(SimpleNamespace(id=1, machine_type=model))
                self.assertEqual(session.data["channel"], AGORA["channel"])
                self.api._fetch_api_resp.assert_awaited_once()
        self.api._log_to_warn.assert_not_called()

    async def test_vendor_errors_or_existing_legacy_fields_do_not_retry(self):
        for response in (
            {"code": 403, "msg": "never-log-this"},
            {"code": 200, "data": {"token": {"sessionToken": "never-log-this"}}},
        ):
            with self.subTest(code=response["code"]):
                self.api._fetch_api_resp.reset_mock()
                self.api._fetch_api_resp.return_value = response
                with self.assertRaises(AnycubicAPIParsingError):
                    await self.api.get_camera_session(SimpleNamespace(id=1, machine_type=20023))
                self.api._fetch_api_resp.assert_awaited_once()
        self.assertNotIn("never-log-this", str(self.api._log_to_warn.call_args_list))

    async def test_alternate_request_can_reuse_an_agora_session(self):
        self.api._fetch_api_resp.side_effect = [
            {"code": "200", "data": {}},
            {"code": 200, "data": {"shengwang": AGORA}},
        ]
        session = await self.api.get_camera_session(SimpleNamespace(id=1, machine_type="20023"))
        self.assertEqual(session.data["channel"], AGORA["channel"])
        self.assertEqual(self.api._fetch_api_resp.await_count, 2)
        self.assertNotIn("test-session", str(self.api._log_to_warn.call_args_list))
