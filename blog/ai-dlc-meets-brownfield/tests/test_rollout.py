import pytest

from rollout import set_flag

DOC = {
    "version": "1",
    "flags": {"new_priority_scoring": {"name": "new_priority_scoring"}},
    "values": {"new_priority_scoring": {"enabled": False}},
}


def test_enable_flag_without_mutating_input():
    updated = set_flag(DOC, "new_priority_scoring", True)
    assert updated["values"]["new_priority_scoring"]["enabled"] is True
    assert DOC["values"]["new_priority_scoring"]["enabled"] is False


def test_unknown_flag_is_rejected():
    with pytest.raises(KeyError):
        set_flag(DOC, "typo_flag", True)


# ---------- One deployment at a time: enable refuses, disable stops and takes over ----------

import io
import json

import rollout


class FakeAppConfig:
    def __init__(self, deployments):
        self.deployments = deployments
        self.calls = []

    def list_deployments(self, **_):
        return {"Items": self.deployments}

    def stop_deployment(self, DeploymentNumber, **_):
        self.calls.append(("stop", DeploymentNumber))
        for d in self.deployments:
            if d["DeploymentNumber"] == DeploymentNumber:
                d["State"] = "ROLLED_BACK"

    def list_hosted_configuration_versions(self, **_):
        return {"Items": [{"VersionNumber": 1}, {"VersionNumber": 2}]}

    def get_hosted_configuration_version(self, VersionNumber, **_):
        self.calls.append(("read", VersionNumber))
        doc = set_flag(DOC, "new_priority_scoring", True)
        return {"Content": io.BytesIO(json.dumps(doc).encode())}

    def create_hosted_configuration_version(self, Content, **_):
        self.calls.append(("create", json.loads(Content)["values"]["new_priority_scoring"]["enabled"]))
        return {"VersionNumber": 3}

    def start_deployment(self, DeploymentStrategyId, ConfigurationVersion, **_):
        self.calls.append(("start", DeploymentStrategyId, ConfigurationVersion))
        return {"DeploymentNumber": 9}


def environment_with(deployments):
    outputs = {
        "application_id": "app", "environment_id": "env", "configuration_profile_id": "prof",
        "gradual_strategy_id": "gradual", "immediate_strategy_id": "immediate",
    }
    return rollout.FlagEnvironment(outputs, FakeAppConfig(deployments))


def test_enable_refuses_while_another_deployment_is_active():
    flags = environment_with([{"DeploymentNumber": 2, "State": "BAKING"}])
    with pytest.raises(SystemExit, match="still BAKING"):
        flags.change_flag("new_priority_scoring", enabled=True)
    assert not any(c[0] == "start" for c in flags.appconfig.calls)


def test_disable_stops_active_rollout_then_deploys_off_immediately():
    flags = environment_with([{"DeploymentNumber": 2, "State": "DEPLOYING"}])
    assert flags.change_flag("new_priority_scoring", enabled=False) == 9
    assert flags.appconfig.calls == [
        ("stop", 2), ("read", 2), ("create", False), ("start", "immediate", "3"),
    ]


def test_enable_uses_gradual_strategy():
    flags = environment_with([{"DeploymentNumber": 1, "State": "COMPLETE"}])
    flags.change_flag("new_priority_scoring", enabled=True)
    assert ("start", "gradual", "3") in flags.appconfig.calls


def test_terraform_outputs_are_read_with_the_configured_binary(monkeypatch, tmp_path):
    seen = {}

    def fake_run(cmd, **_):
        seen["cmd"] = cmd
        payload = {"region": {"value": "us-east-1", "type": "string", "sensitive": False}}
        return type("Result", (), {"stdout": json.dumps(payload)})()

    monkeypatch.setenv("TERRAFORM_BIN", "tofu")
    monkeypatch.setattr(rollout.subprocess, "run", fake_run)
    assert rollout.terraform_outputs(tmp_path) == {"region": "us-east-1"}
    assert seen["cmd"] == ["tofu", f"-chdir={tmp_path}", "output", "-json"]
