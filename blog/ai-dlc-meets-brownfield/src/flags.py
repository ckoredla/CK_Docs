"""Read release flags from the AWS AppConfig Agent Lambda extension.

The extension runs inside the Lambda execution environment, polls AppConfig in
the background, and serves cached values on http://localhost:2772. Reading a
flag is a local HTTP call, not an AWS API call.

Design rule: FAIL CLOSED. Any error means the flag is treated as disabled, so
the legacy path runs.
"""

from __future__ import annotations

import json
import os
import urllib.parse
import urllib.request

EXTENSION_PORT = os.environ.get("AWS_APPCONFIG_EXTENSION_HTTP_PORT", "2772")
TIMEOUT_SECONDS = 1.0


def _flag_url(flag: str) -> str:
    app = os.environ["APPCONFIG_APPLICATION"]
    env = os.environ["APPCONFIG_ENVIRONMENT"]
    profile = os.environ["APPCONFIG_PROFILE"]
    path = "/".join(urllib.parse.quote(p, safe="") for p in ("applications", app, "environments", env, "configurations", profile))
    return f"http://localhost:{EXTENSION_PORT}/{path}?flag={urllib.parse.quote(flag, safe='')}"


def flag_enabled(flag: str) -> bool:
    """Return True only if AppConfig positively says the flag is enabled."""
    # Local-only override for `make run-local` and tests, never set in AWS.
    override = os.environ.get("FLAGS_LOCAL_OVERRIDE")
    if override:
        try:
            return bool(json.loads(override).get(flag, False))
        except (ValueError, AttributeError):
            return False

    try:
        with urllib.request.urlopen(_flag_url(flag), timeout=TIMEOUT_SECONDS) as response:
            body = json.load(response)
        return body.get("enabled") is True
    except Exception:  # noqa: BLE001 - any failure must fall back to legacy
        return False
