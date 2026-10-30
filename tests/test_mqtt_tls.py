"""Real TLS handshake regressions without cloud credentials or printer commands."""
from __future__ import annotations

import ast
import asyncio
import socket
import ssl
import sys
import tempfile
import threading
import unittest
from datetime import (
    datetime,
    timedelta,
    timezone,
)
from os import path
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID

ROOT = Path(__file__).resolve().parents[1] / "custom_components/anycubic_ha_integration"
sys.path.insert(0, str(ROOT))

from anycubic_cloud_api.exceptions.error_strings import ErrorsMQTTClient  # noqa: E402
from anycubic_cloud_api.exceptions.exceptions import AnycubicMQTTClientError  # noqa: E402
from anycubic_cloud_api.helpers.helpers import (  # noqa: E402
    get_mqtt_ssl_path_ca,
    get_mqtt_ssl_path_cert,
    get_mqtt_ssl_path_key,
    get_ssl_cert_directory,
)


def load_methods(**overrides):
    tree = ast.parse((ROOT / "anycubic_cloud_api/api/mqtt.py").read_text(encoding="utf-8"))
    owner = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "AnycubicMQTTAPI")
    methods = [n for n in owner.body if isinstance(n, ast.FunctionDef)
               and n.name in ("_mqtt_build_ssl_context", "connect_mqtt")]
    namespace = dict(ssl=ssl, path=path, asyncio=asyncio, AnycubicMQTTClientError=AnycubicMQTTClientError,
                     ErrorsMQTTClient=ErrorsMQTTClient, get_ssl_cert_directory=get_ssl_cert_directory,
                     get_mqtt_ssl_path_ca=get_mqtt_ssl_path_ca, get_mqtt_ssl_path_cert=get_mqtt_ssl_path_cert,
                     get_mqtt_ssl_path_key=get_mqtt_ssl_path_key, MQTT_HOST="broker.invalid", MQTT_PORT=8883,
                     MQTT_TIMEOUT=60)
    namespace.update(overrides)
    exec(compile(ast.Module(body=methods, type_ignores=[]), "mqtt.py", "exec"), namespace)
    return namespace


class MQTTTLSTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.directory = Path(cls.temp.name)
        cls.key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        cls.now = datetime.now(timezone.utc)
        cls.ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Synthetic test CA")])
        ca = (x509.CertificateBuilder().subject_name(cls.ca_name).issuer_name(cls.ca_name)
              .public_key(cls.key.public_key()).serial_number(x509.random_serial_number())
              .not_valid_before(cls.now - timedelta(days=1)).not_valid_after(cls.now + timedelta(days=1))
              .add_extension(x509.BasicConstraints(ca=True, path_length=None), critical=True)
              .sign(cls.key, hashes.SHA256()))
        cls.ca_path = cls.directory / "ca.pem"
        cls.ca_path.write_bytes(ca.public_bytes(serialization.Encoding.PEM))
        cls.certificates = {}
        for label, untrusted, expired in (("valid", False, False), ("untrusted", True, False), ("expired", False, True)):
            key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            subject = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])
            cert = (x509.CertificateBuilder().subject_name(subject)
                    .issuer_name(subject if untrusted else cls.ca_name).public_key(key.public_key())
                    .serial_number(x509.random_serial_number()).not_valid_before(cls.now - timedelta(days=2))
                    .not_valid_after(cls.now + timedelta(days=-1 if expired else 1))
                    .add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost")]), critical=False)
                    .sign(key if untrusted else cls.key, hashes.SHA256()))
            cert_path, key_path = cls.directory / (label + ".pem"), cls.directory / (label + ".key")
            cert_path.write_bytes(cert.public_bytes(serialization.Encoding.PEM))
            key_path.write_bytes(key.private_bytes(serialization.Encoding.PEM,
                                 serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
            cls.certificates[label] = cert_path, key_path

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def context(self, **overrides):
        host = SimpleNamespace(_log_to_error=lambda message: None)
        return load_methods(**overrides)["_mqtt_build_ssl_context"](host)

    def handshake(self, label="valid", hostname="localhost"):
        context = self.context(get_mqtt_ssl_path_ca=lambda root: str(self.ca_path))
        server_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        server_context.minimum_version = ssl.TLSVersion.TLSv1_2
        server_context.load_cert_chain(*map(str, self.certificates[label]))
        errors = []
        with socket.socket() as listener:
            listener.bind(("127.0.0.1", 0))
            listener.listen(1)
            listener.settimeout(3)

            def server():
                try:
                    conn, _ = listener.accept()
                    with conn, server_context.wrap_socket(conn, server_side=True) as secured:
                        secured.sendall(b"verified")
                except ssl.SSLError:
                    pass  # Expected TLS alert when the client rejects the test certificate.
                except Exception as error:
                    errors.append(type(error).__name__)

            thread = threading.Thread(target=server, daemon=True)
            thread.start()
            try:
                with socket.create_connection(listener.getsockname(), timeout=3) as conn:
                    with context.wrap_socket(conn, server_hostname=hostname) as secured:
                        self.assertEqual(secured.recv(8), b"verified")
            finally:
                thread.join(4)
                self.assertFalse(thread.is_alive())
                self.assertEqual(errors, [])

    def test_context_requires_pinned_ca_hostname_and_tls_12_or_newer(self):
        context = self.context()
        self.assertEqual(context.protocol, ssl.PROTOCOL_TLS_CLIENT)
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(context.check_hostname)
        self.assertEqual(context.minimum_version, ssl.TLSVersion.TLSv1_2)
        self.assertEqual(context.cert_store_stats()["x509_ca"], 1)
        for cipher in context.get_ciphers():
            self.assertGreaterEqual(cipher["strength_bits"], 128)
            self.assertNotIn(cipher["auth"], ("auth-null", "auth-psk"))

    def test_valid_certificate_connects(self):
        self.handshake()

    def test_wrong_hostname_is_rejected(self):
        with self.assertRaises(ssl.SSLCertVerificationError):
            self.handshake(hostname="wrong.invalid")

    def test_untrusted_certificate_is_rejected(self):
        with self.assertRaises(ssl.SSLCertVerificationError):
            self.handshake(label="untrusted")

    def test_expired_certificate_is_rejected(self):
        with self.assertRaises(ssl.SSLCertVerificationError):
            self.handshake(label="expired")

    def test_missing_ca_and_client_certificate_fail_without_insecure_fallback(self):
        missing = str(self.directory / "missing.pem")
        with self.assertRaises(FileNotFoundError):
            self.context(get_mqtt_ssl_path_ca=lambda root: missing)
        with self.assertRaises(AnycubicMQTTClientError):
            self.context(get_mqtt_ssl_path_cert=lambda root: missing)

    def test_connect_mqtt_keeps_verification_enabled_and_propagates_tls_failure(self):
        for fail in (False, True):
            with self.subTest(fail=fail):
                client = MagicMock()
                if fail:
                    client.connect.side_effect = ssl.SSLCertVerificationError("synthetic rejection")
                mqtt = MagicMock()
                mqtt.Client.return_value = client
                context = self.context()
                host = MagicMock()
                host._mqtt_build_ssl_context.return_value = context
                method = load_methods(mqtt_client=mqtt)["connect_mqtt"]
                if fail:
                    with self.assertRaises(ssl.SSLCertVerificationError):
                        method(host)
                    client.loop_forever.assert_not_called()
                else:
                    method(host)
                    client.loop_forever.assert_called_once()
                client.tls_set_context.assert_called_once_with(context)
                client.tls_insecure_set.assert_called_once_with(False)
                client.connect.assert_called_once_with(host="broker.invalid", port=8883, keepalive=60)
