#!/usr/bin/env python3
"""Control the new_priority_scoring release flag. A person runs this, never the agent.

  enable          new flags version, gradual strategy with bake time, alarms watching
  disable         stop any rollout in progress, then new flags version, immediate, no bake (kill switch)
  status          show the latest flag deployment; add --watch to follow it
  purge-versions  delete flags versions created by this script (run before `terraform destroy`)

It reads the AppConfig IDs and the Region from `terraform output`, so run
`terraform apply` (or `make deploy`) first. Set TERRAFORM_BIN=tofu to use OpenTofu.

Examples:
  python scripts/rollout.py enable --watch
  python scripts/rollout.py disable
  python scripts/rollout.py status --watch
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

DEFAULT_TF_DIR = Path(__file__).resolve().parents[1] / "terraform"
DEFAULT_FLAG = "new_priority_scoring"
TERMINAL_STATES = {"COMPLETE", "ROLLED_BACK", "REVERTED"}
ACTIVE_STATES = {"DEPLOYING", "BAKING", "VALIDATING", "ROLLING_BACK"}
POLL_SECONDS = 20


def set_flag(document: dict, flag: str, enabled: bool) -> dict:
    """Return a copy of an AppConfig feature-flags document with one flag changed."""
    if flag not in document.get("flags", {}):
        raise KeyError(f"flag '{flag}' is not defined in the configuration profile")
    updated = json.loads(json.dumps(document))
    updated.setdefault("values", {}).setdefault(flag, {})["enabled"] = enabled
    return updated


def terraform_outputs(tf_dir: Path) -> dict:
    """Read `terraform output -json` and return {name: value}."""
    binary = os.environ.get("TERRAFORM_BIN", "terraform")
    raw = subprocess.run(
        [binary, f"-chdir={tf_dir}", "output", "-json"], check=True, capture_output=True, text=True
    ).stdout
    outputs = {name: item["value"] for name, item in json.loads(raw).items()}
    if not outputs:
        raise SystemExit(f"No Terraform outputs in {tf_dir}. Run `make deploy` first.")
    return outputs


class FlagEnvironment:
    """The AppConfig application, environment and profile created by Terraform."""

    def __init__(self, outputs: dict, appconfig):
        self.app_id = outputs["application_id"]
        self.env_id = outputs["environment_id"]
        self.profile_id = outputs["configuration_profile_id"]
        self.gradual_strategy_id = outputs["gradual_strategy_id"]
        self.immediate_strategy_id = outputs["immediate_strategy_id"]
        self.appconfig = appconfig

    def versions(self) -> list[int]:
        items = self.appconfig.list_hosted_configuration_versions(
            ApplicationId=self.app_id, ConfigurationProfileId=self.profile_id
        )["Items"]
        return sorted(v["VersionNumber"] for v in items)

    def active_deployment(self) -> dict | None:
        items = self.appconfig.list_deployments(ApplicationId=self.app_id, EnvironmentId=self.env_id)["Items"]
        return next((d for d in items if d["State"] in ACTIVE_STATES), None)

    def stop_active_rollout(self) -> None:
        """Kill switch helper: stop a rollout in progress, which reverts it, and wait until it ends."""
        active = self.active_deployment()
        if not active:
            return
        number = active["DeploymentNumber"]
        if active["State"] != "ROLLING_BACK":
            self.appconfig.stop_deployment(ApplicationId=self.app_id, EnvironmentId=self.env_id, DeploymentNumber=number)
            print(f"Stopped deployment #{number} ({active['State']}); AppConfig is reverting it.")
        while self.active_deployment():
            time.sleep(5)

    def change_flag(self, flag: str, enabled: bool) -> int:
        if enabled:
            active = self.active_deployment()
            if active:
                raise SystemExit(
                    f"Deployment #{active['DeploymentNumber']} is still {active['State']}. "
                    "AppConfig runs one deployment per environment at a time. "
                    "Wait for it to finish (make status) or turn the flag off (make disable)."
                )
        else:
            self.stop_active_rollout()
        current = self.appconfig.get_hosted_configuration_version(
            ApplicationId=self.app_id, ConfigurationProfileId=self.profile_id, VersionNumber=self.versions()[-1]
        )
        updated = set_flag(json.loads(current["Content"].read()), flag, enabled)
        new_version = self.appconfig.create_hosted_configuration_version(
            ApplicationId=self.app_id,
            ConfigurationProfileId=self.profile_id,
            Content=json.dumps(updated).encode(),
            ContentType="application/json",
            Description=f"{'enable' if enabled else 'disable'} {flag}",
        )["VersionNumber"]
        strategy = self.gradual_strategy_id if enabled else self.immediate_strategy_id
        number = self.appconfig.start_deployment(
            ApplicationId=self.app_id,
            EnvironmentId=self.env_id,
            ConfigurationProfileId=self.profile_id,
            ConfigurationVersion=str(new_version),
            DeploymentStrategyId=strategy,
            Description=f"{flag} -> {'on' if enabled else 'off'}",
        )["DeploymentNumber"]
        rollout = "gradual, 20 min + 10 min bake" if enabled else "immediate, no bake"
        print(f"Deployment #{number} started: {flag} -> {'ON' if enabled else 'OFF'} "
              f"(flags version {new_version}, {rollout})")
        return number

    def latest_deployment(self) -> int:
        items = self.appconfig.list_deployments(ApplicationId=self.app_id, EnvironmentId=self.env_id)["Items"]
        return max(d["DeploymentNumber"] for d in items)

    def watch(self, number: int, follow: bool) -> int:
        while True:
            d = self.appconfig.get_deployment(ApplicationId=self.app_id, EnvironmentId=self.env_id, DeploymentNumber=number)
            print(f"Deployment #{number}: {d['State']:<12} {d.get('PercentageComplete', 0):5.1f}%  "
                  f"(flags version {d['ConfigurationVersion']})")
            if d["State"] in TERMINAL_STATES or not follow:
                if d["State"] == "ROLLED_BACK":
                    print("Rolled back: an alarm fired during the rollout. The flag is back to its previous value.")
                return 0 if d["State"] != "ROLLED_BACK" else 2
            time.sleep(POLL_SECONDS)

    def purge_versions(self) -> None:
        for number in self.versions()[1:]:  # version 1 belongs to Terraform
            self.appconfig.delete_hosted_configuration_version(
                ApplicationId=self.app_id, ConfigurationProfileId=self.profile_id, VersionNumber=number
            )
            print(f"Deleted flags version {number}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("action", choices=["enable", "disable", "status", "purge-versions"])
    parser.add_argument("--tf-dir", type=Path, default=DEFAULT_TF_DIR, help="folder with the applied Terraform")
    parser.add_argument("--flag", default=DEFAULT_FLAG)
    parser.add_argument("--watch", action="store_true", help="follow the deployment until it finishes")
    args = parser.parse_args()

    import boto3  # imported here so unit tests run without AWS credentials

    outputs = terraform_outputs(args.tf_dir)
    flags = FlagEnvironment(outputs, boto3.Session(region_name=outputs["region"]).client("appconfig"))
    if args.action == "purge-versions":
        flags.purge_versions()
        return 0
    if args.action == "status":
        return flags.watch(flags.latest_deployment(), follow=args.watch)
    number = flags.change_flag(args.flag, enabled=args.action == "enable")
    return flags.watch(number, follow=args.watch)


if __name__ == "__main__":
    sys.exit(main())
