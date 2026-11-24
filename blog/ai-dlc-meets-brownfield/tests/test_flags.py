"""The flag reader must fail closed, and must talk to the real extension contract."""

import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest

import flags


@pytest.fixture(autouse=True)
def appconfig_env(monkeypatch):
    monkeypatch.setenv("APPCONFIG_APPLICATION", "support-ticket-priority")
    monkeypatch.setenv("APPCONFIG_ENVIRONMENT", "prod")
    monkeypatch.setenv("APPCONFIG_PROFILE", "release-flags")
    monkeypatch.delenv("FLAGS_LOCAL_OVERRIDE", raising=False)


@pytest.fixture
def fake_extension(monkeypatch):
    """A stand-in for the AppConfig Agent extension on a random local port."""
    state = {"status": 200, "body": {"enabled": True}, "paths": []}

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            state["paths"].append(self.path)
            self.send_response(state["status"])
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(state["body"]).encode())

        def log_message(self, *args):
            pass

    server = HTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    monkeypatch.setattr(flags, "EXTENSION_PORT", str(server.server_port))
    yield state
    server.shutdown()


def test_reads_enabled_flag_from_extension(fake_extension):
    assert flags.flag_enabled("new_priority_scoring") is True
    assert fake_extension["paths"] == [
        "/applications/support-ticket-priority/environments/prod/configurations/release-flags"
        "?flag=new_priority_scoring"
    ]


def test_disabled_flag(fake_extension):
    fake_extension["body"] = {"enabled": False}
    assert flags.flag_enabled("new_priority_scoring") is False


def test_extension_error_fails_closed(fake_extension):
    fake_extension["status"] = 500
    assert flags.flag_enabled("new_priority_scoring") is False


def test_non_boolean_value_fails_closed(fake_extension):
    fake_extension["body"] = {"enabled": "yes"}
    assert flags.flag_enabled("new_priority_scoring") is False


def test_no_extension_fails_closed(monkeypatch):
    monkeypatch.setattr(flags, "EXTENSION_PORT", "1")  # nothing listens here
    assert flags.flag_enabled("new_priority_scoring") is False


def test_local_override(monkeypatch):
    monkeypatch.setenv("FLAGS_LOCAL_OVERRIDE", '{"new_priority_scoring": true}')
    assert flags.flag_enabled("new_priority_scoring") is True
    monkeypatch.setenv("FLAGS_LOCAL_OVERRIDE", "not json")
    assert flags.flag_enabled("new_priority_scoring") is False
