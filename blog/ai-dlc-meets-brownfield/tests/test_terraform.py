"""Offline checks on the Terraform configuration: the safety properties the
article depends on must hold before anyone runs `terraform apply`."""

import json
from pathlib import Path

import hcl2
import pytest

import rollout

TF = Path(__file__).resolve().parents[1] / "terraform"


def unquote(value):
    return value.strip('"') if isinstance(value, str) else value


def load():
    blocks = {"resource": {}, "data": {}, "output": set()}
    for path in TF.glob("*.tf"):
        doc = hcl2.loads(path.read_text())
        for kind in ("resource", "data"):
            for entry in doc.get(kind, []):
                for typ, named in entry.items():
                    for name, body in named.items():
                        blocks[kind][f"{unquote(typ)}.{unquote(name)}"] = body
        for entry in doc.get("output", []):
            blocks["output"].update(unquote(name) for name in entry)
    return blocks


TFC = load()


def attr(resource, key):
    return unquote(TFC["resource"][resource][key])


def test_flag_ships_off():
    doc = json.loads((TF / "release-flags-v1.json").read_text())
    assert doc["values"]["new_priority_scoring"]["enabled"] is False
    assert "new_priority_scoring" in doc["flags"]


def test_environment_watches_both_alarms():
    monitors = TFC["resource"]["aws_appconfig_environment.prod"]["monitor"]
    alarms = sorted(unquote(m["alarm_arn"]) for m in monitors)
    assert len(monitors) == 2
    assert any("function_errors" in a for a in alarms)
    assert any("priority_disagreement" in a for a in alarms)


def test_turning_on_is_gradual_with_bake():
    s = "aws_appconfig_deployment_strategy.gradual"
    assert (attr(s, "growth_factor"), attr(s, "deployment_duration_in_minutes"), attr(s, "final_bake_time_in_minutes")) == (20, 20, 10)


def test_turning_off_is_immediate_without_bake():
    s = "aws_appconfig_deployment_strategy.immediate"
    assert (attr(s, "growth_factor"), attr(s, "deployment_duration_in_minutes"), attr(s, "final_bake_time_in_minutes")) == (100, 0, 0)
    assert "immediate" in attr("aws_appconfig_deployment.initial", "deployment_strategy_id")


def test_function_uses_appconfig_extension_from_public_ssm_parameter():
    param = TFC["data"]["aws_ssm_parameter.appconfig_extension"]
    assert unquote(param["name"]) == "/aws/service/aws-appconfig/lambda-extension/x86/latest"
    assert "appconfig_extension" in str(TFC["resource"]["aws_lambda_function.scoring"]["layers"])


@pytest.mark.parametrize("name", [
    "region", "function_name", "log_group_name", "application_id", "environment_id",
    "configuration_profile_id", "gradual_strategy_id", "immediate_strategy_id", "disagreement_alarm_name",
])
def test_outputs_used_by_rollout_and_makefile_exist(name):
    assert name in TFC["output"]


def test_rollout_reads_only_declared_outputs():
    source = Path(rollout.__file__).read_text()
    for key in ("application_id", "environment_id", "configuration_profile_id",
                "gradual_strategy_id", "immediate_strategy_id", "region"):
        assert f'"{key}"' in source and key in TFC["output"]
