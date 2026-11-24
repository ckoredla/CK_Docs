import pytest

from scoring import InvalidTicket, Ticket, disagrees, score_legacy, score_v2


def ticket(tier, users=0, down=False, hours=1):
    return Ticket("T", tier, users, down, hours)


@pytest.mark.parametrize("tier,priority", [("enterprise", "P1"), ("business", "P2"), ("standard", "P3")])
def test_legacy_uses_tier_only(tier, priority):
    assert score_legacy(ticket(tier, users=500, down=True))["priority"] == priority


def test_v2_full_outage_for_standard_customer_is_p1():
    result = score_v2(ticket("standard", users=250, down=True))
    assert result["priority"] == "P1"
    assert result["score"] == 7
    assert result["factors"] == {"tier": 1, "service_down": 3, "users_affected": 3}


def test_v2_enterprise_question_is_p2():
    assert score_v2(ticket("enterprise", users=1))["priority"] == "P2"


def test_v2_small_standard_ticket_is_p3():
    assert score_v2(ticket("standard", users=1))["priority"] == "P3"


def test_v2_age_adds_a_point():
    assert score_v2(ticket("business", users=0, hours=30))["factors"]["age"] == 1
    assert score_v2(ticket("business", users=0, hours=30))["priority"] == "P2"


def test_disagreement():
    t = ticket("standard", users=250, down=True)
    assert disagrees(score_legacy(t), score_v2(t))
    t = ticket("business", users=40)
    assert not disagrees(score_legacy(t), score_v2(t))


@pytest.mark.parametrize("event", [
    {},
    {"ticket_id": "X", "customer_tier": "gold", "users_affected": 1, "service_down": False, "hours_open": 1},
    {"ticket_id": "X", "customer_tier": "business", "users_affected": -1, "service_down": False, "hours_open": 1},
    {"ticket_id": "X", "customer_tier": "business", "users_affected": 1, "service_down": False, "hours_open": "abc"},
])
def test_invalid_events(event):
    with pytest.raises(InvalidTicket):
        Ticket.from_event(event)
