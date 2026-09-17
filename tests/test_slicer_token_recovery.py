"""Offline tests with synthetic credentials; never touch process memory or cloud."""
import base64
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import MagicMock, patch

spec = importlib.util.spec_from_file_location(
    "slicer_recovery", Path(__file__).resolve().parents[1] / "scripts/recover_slicer_token.py"
)
recovery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(recovery)


def fake_token(**overrides):
    claims = {"tokenType": "access-token", "iss": "https://uc.makeronline.com",
              "sub": "synthetic-account", "exp": 200, "iat": 50}
    claims.update(overrides)
    payload = base64.urlsafe_b64encode(json.dumps(claims).encode()).rstrip(b"=")
    return b"eyJhbGciOiJub25lIn0." + payload + b".synthetic"


class TokenRecoveryTests(unittest.TestCase):
    def test_rejects_wrong_type_issuer_expired_and_malformed(self):
        tokens = {fake_token(tokenType="id-token"), fake_token(tokenType="refresh-token"),
                  fake_token(iss="https://example.invalid"), fake_token(exp=99),
                  fake_token(exp=None), fake_token(nbf=150), fake_token(sub=None), b"not-a-jwt"}
        self.assertEqual(recovery.access_candidates(tokens, 100), [])

    def test_prefers_shortest_observed_copy_not_longest_memory_match(self):
        token = fake_token()
        candidates = recovery.access_candidates({token, token + b"trailingmemory"}, 100)
        self.assertEqual(len(candidates), 1)
        self.assertEqual(candidates[0][2], token.decode())

    def test_refuses_multiple_accounts(self):
        with self.assertRaises(recovery.RecoveryError):
            recovery.access_candidates({fake_token(), fake_token(sub="another-account")}, 100)

    def test_newest_token_first_for_one_account(self):
        older = fake_token(iat=10)
        newer = fake_token(iat=80)
        self.assertEqual(recovery.access_candidates({older, newer}, 100)[0][2], newer.decode())

    def test_cloud_success_requires_success_code_and_nonempty_token(self):
        constants = recovery.load_constants()
        for result, expected in [
            ({"code": 1, "data": {"token": "synthetic-user-token"}}, True),
            ({"code": 0, "data": {"token": "synthetic-user-token"}}, False),
            ({"code": 1, "data": None}, False),
            ({"code": 1, "data": {"token": ""}}, False),
            (None, False),
        ]:
            with self.subTest(result=result):
                opener = MagicMock()
                with patch.object(recovery.urllib.request, "build_opener", return_value=opener), \
                        patch.object(recovery.json, "load", return_value=result):
                    self.assertEqual(recovery.validate_token("synthetic-token", constants), expected)

    def test_cloud_redirect_is_not_followed(self):
        with self.assertRaises(recovery.RecoveryError):
            recovery.NoRedirects().redirect_request(None, None, 302, "", {}, "https://example.invalid")


if __name__ == "__main__":
    unittest.main()
