"""Exercise the real authentication flow methods at the HA runtime boundary."""
from __future__ import annotations

import ast
import traceback
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock


SOURCE = Path(__file__).resolve().parents[1] / "custom_components/anycubic_ha_integration/config_flow.py"


class AuthenticationRetryTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.created = []

        def create(hass, token, mode, device):
            api = SimpleNamespace(
                credentials=(token, mode, device),
                check_api_tokens=AsyncMock(return_value=token == "fresh-token"),
            )
            self.created.append(api)
            return api

        self.load_store = AsyncMock()
        namespace = {
            "async_create_anycubic_api": create,
            "async_load_tokens_from_store": self.load_store,
            "remove_quotes_from_string": lambda value: value.strip('"'),
            "CONF_USER_TOKEN": "user_token", "CONF_USER_DEVICE_ID": "user_device_id",
            "LOGGER": Mock(), "traceback": traceback,
        }
        tree = ast.parse(SOURCE.read_text(encoding="utf-8"))
        owner = next(n for n in tree.body if isinstance(n, ast.ClassDef)
                     and n.name == "AnycubicCloudConfigFlow")
        names = {"_async_create_anycubic_api", "_async_check_anycubic_api_instance_exists",
                 "_async_check_login_errors", "_async_check_authentication_with_user_input",
                 "_errors_unknown_authentication_failure"}
        methods = [n for n in owner.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))
                   and n.name in names]
        module = ast.Module(body=[ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0),
                                 *methods], type_ignores=[])
        ast.fix_missing_locations(module)
        exec(compile(module, str(SOURCE), "exec"), namespace)
        cls = type("AuthFlow", (), {n.name: namespace[n.name] for n in methods})
        self.flow = cls()
        self.flow.hass = object()
        self.flow.entry = None
        self.flow._is_reauth = False
        self.flow._anycubic_api = None

    async def submit(self, token, mode=3, device=None):
        return await self.flow._async_check_authentication_with_user_input(
            mode, {"user_token": token, "user_device_id": device})

    async def test_retry_checks_new_token_and_keeps_accepted_client_for_printers(self):
        self.assertEqual(await self.submit("old-token"), {"base": "invalid_auth"})
        self.assertEqual(await self.submit('"fresh-token"'), {})
        self.assertEqual([a.credentials[0] for a in self.created], ["old-token", "fresh-token"])
        accepted = self.flow._anycubic_api
        await self.flow._async_check_anycubic_api_instance_exists()
        self.assertIs(self.flow._anycubic_api, accepted)
        self.assertEqual(len(self.created), 2)
        self.load_store.assert_not_awaited()

    async def test_retry_uses_new_auth_mode_and_device_id(self):
        await self.submit("old-token", mode=1)
        self.assertEqual(await self.submit("fresh-token", mode=2, device="test-device"), {})
        self.assertEqual(self.created[-1].credentials, ("fresh-token", 2, "test-device"))
        self.assertEqual(await self.submit("fresh-token", mode=3), {})
        self.assertEqual(self.created[-1].credentials, ("fresh-token", 3, None))

    async def test_explicit_input_does_not_load_saved_credentials(self):
        self.flow.entry = object()
        for reauth in (False, True):
            with self.subTest(reauth=reauth):
                self.flow._is_reauth = reauth
                self.assertEqual(await self.submit("fresh-token"), {})
                self.load_store.assert_not_awaited()

    async def test_existing_printer_configuration_still_loads_saved_credentials(self):
        self.flow.entry = object()
        self.flow._user_token = "saved-token"
        self.flow._user_auth_mode = 3
        self.flow._user_device_id = None
        await self.flow._async_check_anycubic_api_instance_exists()
        self.load_store.assert_awaited_once_with(self.flow.hass, self.created[0])


if __name__ == "__main__":
    unittest.main()
