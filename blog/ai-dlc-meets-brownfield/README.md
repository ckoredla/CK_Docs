# Support Ticket Priority: ship AI-built changes dark, release them on your terms

Companion code for the article [AI-DLC Meets Brownfield: Shipping AI-Built Changes Without Breaking Production](article.md), which lives in this same folder.

In about an hour of mostly waiting, you'll use Terraform to deploy a Lambda function to your own AWS account, put new priority logic behind an AWS AppConfig feature flag, roll it out gradually, and watch a CloudWatch alarm roll it back for you. Every command is in the `Makefile`, so you can follow along by typing `make <step>`.

## The use case

A support platform assigns every incoming ticket a priority, and the priority decides which queue it lands in and how fast someone responds.

- **Today's rule (legacy):** priority comes from the customer's tier alone. Enterprise is `P1`, business is `P2`, standard is `P3`. A how-to question from an enterprise customer jumps ahead of a full outage for a standard customer.
- **New rule (v2), built with AI-DLC:** an impact score. The tier adds 3, 2 or 1 points. A service that is down adds 3. At least 100 affected users adds 3, at least 10 adds 2. A ticket open for 24 hours or more adds 1. A score of 6 or more is `P1`, 3 or more is `P2`, anything lower is `P3`.

Support teams, dashboards and SLAs already depend on the legacy priority, so v2 must not change anything until a person decides it should. That's what the flag is for.

## How it fits together

```
make deploy  ──► Lambda (flag OFF) ──► legacy priority only
                      │
make enable  ──► AWS AppConfig ──► flag ON, 20% of execution environments every 4 min, then 10 min bake
                      │                         │
                      │               Lambda ──► legacy priority + "v2" result beside it
                      │                         │
                      └── auto rollback ◄── CloudWatch alarms ◄── Errors, PriorityDisagreement (EMF)
```

| File | What it does |
| --- | --- |
| `terraform/appconfig.tf` | AppConfig application, `release-flags` profile, flags version 1 (off), the `prod` environment watching two alarms, a gradual strategy for turning on and an immediate one for turning off, the role AppConfig uses to read alarms |
| `terraform/lambda.tf` | The Lambda function with the AppConfig Agent extension layer, its IAM role scoped to this application's flags, its log group |
| `terraform/alarms.tf` | The `function-errors` and `priority-disagreement` CloudWatch alarms |
| `terraform/outputs.tf` | IDs and names that `scripts/rollout.py` and the `Makefile` read with `terraform output` |
| `terraform/release-flags-v1.json` | The flag definition that ships with `new_priority_scoring` off |
| `src/app.py` | The single flag seam. Legacy always runs; v2 is added beside it; a `PriorityDisagreement` metric is emitted |
| `src/flags.py` | Reads the flag from the extension at `localhost:2772`. Any error means "off" |
| `src/scoring.py` | Legacy and v2 priority rules |
| `scripts/rollout.py` | The human controls: `enable`, `disable`, `status`, `purge-versions` |
| `events/*.json` | Three tickets: a full outage for a standard customer, a how-to question from an enterprise customer, a partial slowdown for a business customer |
| `tests/` | 54 tests: the flag-off contract, flag-on additivity, fail-closed flag reads, the example tickets, the rollout CLI, and offline checks that the Terraform keeps its safety properties |

## Before you start

You need:

| Tool | Check it with | Version used here |
| --- | --- | --- |
| Terraform or OpenTofu | `terraform version` or `tofu version` | Terraform 1.5 or later, AWS provider 5.70 or later |
| Python | `python3 --version` | 3.13 |
| AWS CLI | `aws --version` | v2 |
| GNU Make | `make --version` | any |

Using OpenTofu? Add `TF=tofu` to every `make` command, for example `make deploy TF=tofu`.

You also need credentials for an AWS account you're allowed to experiment in. Terraform uses the same credentials as the AWS CLI. Confirm which account you're about to deploy to:

```sh
aws sts get-caller-identity
```

Your identity needs permission to create Lambda functions, IAM roles and role policies, AppConfig resources, CloudWatch alarms and log groups, and to read the public SSM parameter for the AppConfig extension.

Everything deploys to **us-east-1**. To use another Region, pass it to the commands that create and delete resources: `make plan REGION=eu-west-1`, `make deploy REGION=eu-west-1` and `make destroy REGION=eu-west-1`. Every other command reads the Region from `terraform output`.

Terraform keeps its state in `terraform/terraform.tfstate` on your machine. That's fine for this walkthrough. When you adopt the pattern in a team, move the state to a shared backend such as Amazon S3.

What you'll pay for: Lambda invocations and AppConfig configuration requests in this walkthrough are tiny volumes, and two CloudWatch alarms are billed monthly while they exist. Check [CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/) and [AppConfig pricing](https://aws.amazon.com/systems-manager/pricing/), and run `make destroy` when you're done.

## Step 1: Get the code and run the tests

```sh
git clone https://github.com/ckoredla/CK_Docs.git
cd CK_Docs/blog/ai-dlc-meets-brownfield
make setup
make test
```

`make setup` creates a Python virtual environment and runs `terraform init`, which downloads the AWS and archive providers. You should see `54 passed`. Five of those tests run the handler with the flag **off**: they prove that deploying this code changes nothing for current users. That's the habit worth copying.

## Step 2: Run it on your laptop with the flag forced on

```sh
make run-local
```

```json
{
  "ticket_id": "TCK-1001",
  "priority": "P3",
  "method": "legacy-customer-tier",
  "v2": {
    "priority": "P1",
    "method": "v2-impact-score",
    "score": 7,
    "factors": {"tier": 1, "service_down": 3, "users_affected": 3}
  }
}
```

The two rules disagree here: a standard customer whose service is down for 250 users sits in the `P3` queue today, and v2 moves it to `P1`. That disagreement is exactly what you want a person, and an alarm, to watch during rollout. Try the other tickets with `make run-local EVENT=events/enterprise-how-to-question.json` and `make run-local EVENT=events/business-partial-slowdown.json`.

## Step 3: Deploy with the flag off

```sh
make deploy
```

Terraform shows its plan and ends with `Plan: 16 to add, 0 to change, 0 to destroy.` Read it, then type `yes`. It creates the AppConfig resources, deploys flags version 1 with `new_priority_scoring` off, and creates the function, its role and the two alarms. Now call the function:

```sh
make invoke
```

```json
{"ticket_id": "TCK-1001", "priority": "P3", "method": "legacy-customer-tier"}
```

No `v2` field. The new code is in production and nobody can tell. That's "shipping dark."

## Step 4: Be the human gate and turn it on

```sh
make enable
```

`rollout.py` creates flags version 2 with the flag on and starts a deployment with the gradual strategy. It prints progress every 20 seconds:

```
Deployment #2 started: new_priority_scoring -> ON (flags version 2, gradual, 20 min + 10 min bake)
Deployment #2: DEPLOYING      0.0%  (flags version 2)
Deployment #2: DEPLOYING     20.0%  (flags version 2)
...
Deployment #2: BAKING       100.0%  (flags version 2)
Deployment #2: COMPLETE     100.0%  (flags version 2)
```

The whole rollout takes 30 minutes: 20 to reach every execution environment, 10 to bake while alarms watch. You can stop watching with `Ctrl+C`; the rollout keeps going, and `make status` shows where it is. Run `make invoke` again during or after the rollout and you'll start seeing the `v2` field.

Notice that Terraform created flags version 1, but a person creates every later version with `rollout.py`. Terraform owns the infrastructure; people own the release decision. Don't put the flag value in a Terraform variable, or a routine `terraform apply` becomes a release.

Two things to know:

- AppConfig rolls out by **configuration fetch**, which here means per Lambda execution environment, not per end user.
- The extension refreshes every 15 seconds (`AWS_APPCONFIG_EXTENSION_POLL_INTERVAL_SECONDS`), so a change takes effect within about that interval.

## Step 5: Use the kill switch

```sh
make disable
```

If a rollout is still in progress, `rollout.py` stops it first (AppConfig reverts it), then deploys a new version with the flag off using the `immediate-no-bake` strategy. Every Lambda execution environment picks up the change at its next 15-second poll. Turning something **on** is gradual; turning it **off** is immediate. Keep that asymmetry in your own systems.

## Step 6: Watch AppConfig roll back for you

```sh
make rollback-demo
```

This starts a new `enable` rollout, waits 60 seconds, then forces the `support-ticket-priority-priority-disagreement` alarm into `ALARM`, the same thing that would happen if v2 started moving too many tickets into a different queue. Within a poll cycle you'll see:

```
Deployment #4: ROLLED_BACK    ...
Rolled back: an alarm fired during the rollout. The flag is back to its previous value.
```

Nobody had to be awake for that. The alarm goes back to `OK` at its next 5-minute evaluation.

To see the metrics behind the alarm, open **CloudWatch → Metrics → All metrics → SupportTicketPriority → Service**, or tail the function's logs with `make logs`.

## Step 7: Clean up

```sh
make destroy
```

This first deletes the flag versions that `rollout.py` created (Terraform only knows about version 1), then runs `terraform destroy`. Type `yes` when Terraform asks.

## Troubleshooting

| You see | Do this |
| --- | --- |
| `make invoke` still has no `v2` after `make enable` | Check `make status`. During a gradual rollout only some execution environments have the new value; wait for `COMPLETE`, then invoke again after 15 seconds |
| `make enable` says another deployment is still `DEPLOYING` or `BAKING` | AppConfig runs one deployment per environment at a time. Wait for `make status` to show `COMPLETE` or `ROLLED_BACK`, or run `make disable` to stop it |
| `terraform apply` can't read `/aws/service/aws-appconfig/lambda-extension/x86/latest` | The AppConfig Agent extension isn't published in that Region. Deploy with `REGION=us-east-1` |
| `make enable` says there are no Terraform outputs | Run `make deploy` first, from the same folder. `rollout.py` reads `terraform output` in `terraform/` |
| `terraform destroy` fails deleting the configuration profile or environment | Run `make destroy` again. If your account has AppConfig deletion protection turned on, wait out its protection period (it blocks deleting resources that were recently read) and retry |
| `make enable` exits with `ROLLED_BACK` without you forcing it | An alarm actually fired. Look at `make logs` for errors and the `PriorityDisagreement` metric before you try again |

## Bring this pattern to your own brownfield app

1. Pick the one function or service entry point where your new behavior starts. That's your seam: copy `src/flags.py` and call `flag_enabled()` there, once.
2. Keep the legacy result as the system of record and return the new result beside it, exactly like `src/app.py` does.
3. Write the flag-off tests first, using `tests/test_handler.py` as the model. They're your proof that a deploy changes nothing.
4. Copy `terraform/appconfig.tf` and `terraform/alarms.tf` into your own Terraform, and change `PriorityDisagreement` to the business signal that tells you your new logic is wrong.
5. Give your AI coding agent the release rule from the article, so every unit of work it builds follows steps 1 to 3 automatically.
6. Remove the flag and the legacy path once the new behavior is accepted. A release flag that lives forever is debt.

## License

MIT-0. Opinions are the author's own and do not represent any employer.
