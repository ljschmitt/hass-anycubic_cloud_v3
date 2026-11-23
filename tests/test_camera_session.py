"""Exercise the Kobra 2 Max camera probe without contacting Anycubic."""
import unittest
from types import SimpleNamespace
from unittest.mock import (
    AsyncMock,
    MagicMock,
    Mock,
)
from urllib.parse import parse_qs, urlsplit

from test_ace_drying import methods

# isort: split
from anycubic_cloud_api.const.api_endpoints import API_ENDPOINT
from anycubic_cloud_api.const.enums import AnycubicOrderID
from anycubic_cloud_api.data_models.orders import (
    AnycubicBaseOrderRequest,
    AnycubicCameraSession,
    AnycubicCameraToken,
)
from anycubic_cloud_api.exceptions.exceptions import AnycubicAPIParsingError, AnycubicLegacyCameraError
from anycubic_cloud_api.legacy_camera import prepare_legacy_camera

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
    "AnycubicCameraToken": AnycubicCameraToken,
    "AnycubicAPIParsingError": AnycubicAPIParsingError,
    "AnycubicLegacyCameraError": AnycubicLegacyCameraError,
    "_AGORA_CAMERA_FIELDS": tuple(AGORA),
})
API = type("OfflineAPI", (), {name: namespace[name] for name in METHODS})


class CameraSessionTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.api = API()
        self.api._fetch_api_resp = AsyncMock()
        self.api._log_to_warn = Mock()
        self.api.printer_capture = Mock()

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
            {"code": "1", "data": {}},
            {"code": 200, "data": {"shengwang": AGORA}},
        ]
        session = await self.api.get_camera_session(SimpleNamespace(id=1, machine_type="20023"))
        self.assertEqual(session.data["channel"], AGORA["channel"])
        self.assertEqual(self.api._fetch_api_resp.await_count, 2)
        self.assertNotIn("test-session", str(self.api._log_to_warn.call_args_list))

    async def test_kobra_2_max_legacy_credentials_are_routed_to_kinesis(self):
        self.api._fetch_api_resp.return_value = {"code": 1, "data": {"token": {
            "tmpSecretId": "viewer", "tmpSecretKey": "never-log-this",
            "sessionToken": "never-export-this", "region": "us-east-2",
        }}}
        token = await self.api.get_camera_session(SimpleNamespace(id=1, machine_type=20023))
        self.assertIsInstance(token, AnycubicCameraToken)
        self.assertEqual(token.region, "us-east-2")
        self.api._fetch_api_resp.assert_awaited_once()
        self.api.printer_capture.record.assert_called_once_with(
            1, "cloud", "camera_open", {"code": 1, "agora": {"status": False}, "kinesis": {"status": True}}
        )
        self.assertNotIn("never-log-this", str(self.api._log_to_warn.call_args_list))

    async def test_other_models_do_not_use_kobra_2_max_legacy_handling(self):
        self.api._fetch_api_resp.return_value = {"code": 1, "data": {"token": {"sessionToken": "never-log-this"}}}
        for model in (20021, 20024, 20030):
            with self.subTest(model=model):
                self.api._fetch_api_resp.reset_mock()
                with self.assertRaises(AnycubicAPIParsingError) as result:
                    await self.api.get_camera_session(SimpleNamespace(id=1, machine_type=model))
                self.assertIs(type(result.exception), AnycubicAPIParsingError)
                self.api._fetch_api_resp.assert_awaited_once()
        self.api._log_to_warn.assert_not_called()

class KinesisSetupTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.token = AnycubicCameraToken("viewer", "signing-secret", "test-session", "us-east-2", "")
        self.arn = "arn:aws:kinesisvideo:us-east-2:123456789012:channel/test-printer/1000"
        self.client = Mock()

    def response(self, payload):
        cm = MagicMock()
        cm.__aenter__.return_value = SimpleNamespace(status=200, json=AsyncMock(return_value=payload))
        return cm

    async def test_only_channel_scoped_url_and_ice_are_returned(self):
        host = "viewer.kinesisvideo.us-east-2.amazonaws.com"
        self.client.post.side_effect = [
            self.response({"ChannelInfo": {"ChannelARN": self.arn}}),
            self.response({"ResourceEndpointList": [
                {"Protocol": "HTTPS", "ResourceEndpoint": f"https://{host}"},
                {"Protocol": "WSS", "ResourceEndpoint": f"wss://{host}"},
            ]}),
            self.response({"IceServerList": [
                {"Uris": ["turn:example.com:443"], "Username": "turn-user", "Password": "turn-password"},
            ]}),
        ]
        result = await prepare_legacy_camera(self.client, self.token, "test-printer")
        self.assertEqual(set(result), {"transport", "signaling_url", "ice_servers"})
        url = urlsplit(result["signaling_url"])
        self.assertEqual((url.scheme, url.hostname), ("wss", host))
        params = parse_qs(url.query)
        self.assertEqual(params["X-Amz-ChannelARN"], [self.arn])
        self.assertEqual(params["X-Amz-Expires"], ["60"])
        self.assertEqual(len(params["X-Amz-Signature"][0]), 64)
        self.assertNotIn("signing-secret", str(result))
        self.assertEqual(len(result["ice_servers"]), 2)
        calls = self.client.post.call_args_list
        self.assertEqual([urlsplit(c.args[0]).path for c in calls], [
            "/describeSignalingChannel", "/getSignalingChannelEndpoint", "/v1/get-ice-server-config",
        ])
        self.assertIn(b'"ChannelName":"test-printer"', calls[0].kwargs["data"])
        self.assertTrue(all(c.kwargs["allow_redirects"] is False for c in calls))

    async def test_rejects_non_aws_endpoint_before_sending_credentials(self):
        self.client.post.side_effect = [
            self.response({"ChannelInfo": {"ChannelARN": self.arn}}),
            self.response({"ResourceEndpointList": [
                {"Protocol": "HTTPS", "ResourceEndpoint": "https://example.com"},
                {"Protocol": "WSS", "ResourceEndpoint": "wss://example.com"},
            ]}),
        ]
        with self.assertRaisesRegex(ValueError, "Unexpected Kinesis endpoint"):
            await prepare_legacy_camera(self.client, self.token, "test-printer")
        self.assertEqual(self.client.post.call_count, 2)
