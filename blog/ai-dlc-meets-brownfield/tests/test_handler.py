"""Both flag states are tested. The flag-off suite is the regression contract."""

import json
from pathlib import Path

import pytest

import app
from scoring import Ticket, score_legacy

EVENTS = [
    {"ticket_id": "A", "customer_tier": "standard", "users_affected": 250, "service_down": True, "hours_open": 2},
    {"ticket_id": "B", "customer_tier": "enterprise", "users_affected": 1, "service_down": False, "hours_open": 1},
    {"ticket_id": "C", "customer_tier": "business", "users_affected": 40, "service_down": False, "hours_open": 5},
    {"ticket_id": "D", "customer_tier": "standard", "users_affected": 0, "service_down": False, "hours_open": 72},
]


@pytest.fixture
def flag(monkeypatch):
    def set_state(enabled: bool):
        monkeypatch.setattr(app, "flag_enabled", lambda name: enabled)
    return set_state


# ---------- Flag OFF: deploying the new code must be a no-op for users ----------

@pytest.mark.parametrize("event", EVENTS, ids=lambda e: e["ticket_id"])
def test_flag_off_returns_exactly_the_legacy_result(flag, event):
    flag(False)
    assert app.handler(event) == score_legacy(Ticket.from_event(event))


def test_flag_off_emits_no_v2_metrics(flag, capsys):
    flag(False)
    app.handler(EVENTS[0])
    assert capsys.readouterr().out == ""


# ---------- Flag ON: v2 is additive, legacy fields are untouched ----------

@pytest.mark.parametrize("event", EVENTS, ids=lambda e: e["ticket_id"])
def test_flag_on_keeps_every_legacy_field(flag, event):
    flag(True)
    result = app.handler(event)
    legacy = score_legacy(Ticket.from_event(event))
    assert {k: result[k] for k in legacy} == legacy
    assert "v2" in result


def test_flag_on_emits_embedded_metric(flag, capsys):
    flag(True)
    app.handler(EVENTS[0])  # legacy P3 (standard tier), v2 P1 (full outage, 250 users)
    record = json.loads(capsys.readouterr().out)
    assert record["_aws"]["CloudWatchMetrics"][0]["Namespace"] == "SupportTicketPriority"
    assert record["PriorityDisagreement"] == 1
    assert record["Service"] == "support-ticket-priority"


# ---------- Bad input never reaches either rule ----------

def test_invalid_event_returns_error(flag):
    flag(True)
    assert "error" in app.handler({"ticket_id": "X"})


# ---------- The event files used in the README behave as documented ----------

EVENTS_DIR = Path(__file__).resolve().parents[1] / "events"
EXPECTED = {  # file: (legacy priority, v2 priority)
    "standard-customer-full-outage.json": ("P3", "P1"),
    "enterprise-how-to-question.json": ("P1", "P2"),
    "business-partial-slowdown.json": ("P2", "P2"),
}


@pytest.mark.parametrize("name", sorted(EXPECTED))
def test_documented_events(flag, name):
    flag(True)
    result = app.handler(json.loads((EVENTS_DIR / name).read_text()))
    assert (result["priority"], result["v2"]["priority"]) == EXPECTED[name]


def test_every_event_file_is_documented():
    assert sorted(p.name for p in EVENTS_DIR.glob("*.json")) == sorted(EXPECTED)
