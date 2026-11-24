"""Support ticket priority: the legacy rule and the v2 rule built with AI-DLC.

Legacy (what users rely on today): priority comes from the customer's tier only.
v2 (the new behavior behind the flag): priority comes from an impact score that
adds up tier, outage, number of users affected and ticket age.
"""

from __future__ import annotations

from dataclasses import dataclass

TIERS = ("enterprise", "business", "standard")
LEGACY_PRIORITY = {"enterprise": "P1", "business": "P2", "standard": "P3"}

# v2 impact score. Each factor adds points; the total maps to a priority.
TIER_POINTS = {"enterprise": 3, "business": 2, "standard": 1}
OUTAGE_POINTS = 3                      # the customer's service is down
USERS_POINTS = ((100, 3), (10, 2))     # (at least N users affected, points)
AGE_POINTS, AGE_HOURS = 1, 24          # open for a day or more
P1_AT, P2_AT = 6, 3                    # score thresholds


class InvalidTicket(ValueError):
    """Raised when the input event is missing fields or has impossible values."""


@dataclass(frozen=True)
class Ticket:
    ticket_id: str
    customer_tier: str
    users_affected: int
    service_down: bool
    hours_open: float

    @classmethod
    def from_event(cls, event: dict) -> "Ticket":
        try:
            ticket = cls(
                ticket_id=str(event["ticket_id"]),
                customer_tier=str(event["customer_tier"]).lower(),
                users_affected=int(event["users_affected"]),
                service_down=bool(event["service_down"]),
                hours_open=float(event["hours_open"]),
            )
        except (KeyError, TypeError, ValueError) as exc:
            raise InvalidTicket(f"invalid ticket event: {exc}") from exc
        if ticket.customer_tier not in TIERS:
            raise InvalidTicket(f"customer_tier must be one of {', '.join(TIERS)}")
        if ticket.users_affected < 0 or ticket.hours_open < 0:
            raise InvalidTicket("users_affected and hours_open must be >= 0")
        return ticket


def score_legacy(ticket: Ticket) -> dict:
    """Today's behavior. With the flag off, the handler returns exactly this."""
    return {
        "ticket_id": ticket.ticket_id,
        "priority": LEGACY_PRIORITY[ticket.customer_tier],
        "method": "legacy-customer-tier",
    }


def score_v2(ticket: Ticket) -> dict:
    """New behavior: prioritize by impact, so a full outage for a standard
    customer outranks a how-to question from an enterprise customer."""
    factors = {"tier": TIER_POINTS[ticket.customer_tier]}
    if ticket.service_down:
        factors["service_down"] = OUTAGE_POINTS
    for at_least, points in USERS_POINTS:
        if ticket.users_affected >= at_least:
            factors["users_affected"] = points
            break
    if ticket.hours_open >= AGE_HOURS:
        factors["age"] = AGE_POINTS

    score = sum(factors.values())
    priority = "P1" if score >= P1_AT else "P2" if score >= P2_AT else "P3"
    return {"priority": priority, "method": "v2-impact-score", "score": score, "factors": factors}


def disagrees(legacy: dict, v2: dict) -> bool:
    """True when the two rules would put the ticket in different queues."""
    return legacy["priority"] != v2["priority"]
