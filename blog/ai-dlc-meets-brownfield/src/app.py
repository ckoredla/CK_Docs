"""Lambda handler: one flag seam between legacy and v2 ticket priority.

Rules this file follows (from the article's agent rule file):
- the flag is read once, at the entry point;
- the legacy result is always computed and stays the system of record;
- the v2 result is ADDED beside the legacy fields, never written over them;
- a comparison metric is emitted so CloudWatch can roll the flag back.
"""

from __future__ import annotations

import json
import os
import time

from flags import flag_enabled
from scoring import InvalidTicket, Ticket, disagrees, score_legacy, score_v2

FLAG = "new_priority_scoring"
METRIC_NAMESPACE = os.environ.get("METRIC_NAMESPACE", "SupportTicketPriority")
SERVICE = os.environ.get("SERVICE_NAME", "support-ticket-priority")


def emit_metrics(**values: float) -> None:
    """Write CloudWatch metrics with the Embedded Metric Format (no SDK call)."""
    print(json.dumps({
        "_aws": {
            "Timestamp": int(time.time() * 1000),
            "CloudWatchMetrics": [{
                "Namespace": METRIC_NAMESPACE,
                "Dimensions": [["Service"]],
                "Metrics": [{"Name": name, "Unit": "Count"} for name in values],
            }],
        },
        "Service": SERVICE,
        **values,
    }))


def handler(event, context=None):
    try:
        ticket = Ticket.from_event(event)
    except InvalidTicket as exc:
        return {"error": str(exc)}

    legacy = score_legacy(ticket)

    if not flag_enabled(FLAG):
        return legacy  # flag off: byte-for-byte the behavior users have today

    v2 = score_v2(ticket)
    emit_metrics(V2Evaluated=1, PriorityDisagreement=1 if disagrees(legacy, v2) else 0)
    return {**legacy, "v2": v2}
