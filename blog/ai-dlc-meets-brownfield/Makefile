# Support Ticket Priority - every command in the article, in one place.
# Works with Terraform or OpenTofu: make deploy TF=tofu

REGION ?= us-east-1
TF     ?= terraform
TFDIR  := terraform
EVENT  ?= events/standard-customer-full-outage.json
VENV   := .venv
PY     := $(VENV)/bin/python
OUT     = $(TF) -chdir=$(TFDIR) output -raw

export TERRAFORM_BIN := $(TF)

.PHONY: setup test run-local plan deploy invoke enable disable status rollback-demo logs destroy

setup:            ## Python tooling for tests and the rollout CLI, plus terraform init
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install -q -r requirements-dev.txt
	$(TF) -chdir=$(TFDIR) init

test:             ## Unit tests for both flag states + Terraform safety checks
	$(VENV)/bin/pytest -q

run-local:        ## Run the handler on your laptop with the flag forced ON
	cd src && FLAGS_LOCAL_OVERRIDE='{"new_priority_scoring": true}' \
	APPCONFIG_APPLICATION=support-ticket-priority APPCONFIG_ENVIRONMENT=prod APPCONFIG_PROFILE=release-flags \
	../$(PY) -c "import json, app; print(json.dumps(app.handler(json.load(open('../$(EVENT)'))), indent=2))"

plan:             ## Show what Terraform will create
	$(TF) -chdir=$(TFDIR) plan -var region=$(REGION)

deploy:           ## Create everything with the flag OFF (asks you to type yes)
	$(TF) -chdir=$(TFDIR) apply -var region=$(REGION)

invoke:           ## Call the deployed function with an event file
	aws lambda invoke --region "$$($(OUT) region)" --function-name "$$($(OUT) function_name)" \
	  --payload fileb://$(EVENT) response.json > /dev/null
	@cat response.json; echo

enable:           ## Human gate: turn the flag ON gradually and follow the rollout
	$(PY) scripts/rollout.py enable --watch

disable:          ## Kill switch: turn the flag OFF immediately
	$(PY) scripts/rollout.py disable --watch

status:           ## Show the latest flag deployment
	$(PY) scripts/rollout.py status

rollback-demo:    ## Start a rollout, trip the business alarm, watch AppConfig roll back
	$(PY) scripts/rollout.py enable
	sleep 60
	aws cloudwatch set-alarm-state --region "$$($(OUT) region)" \
	  --alarm-name "$$($(OUT) disagreement_alarm_name)" \
	  --state-value ALARM --state-reason "rollback demo: forced by make rollback-demo"
	$(PY) scripts/rollout.py status --watch

logs:             ## Tail the function's logs, including the EMF metric lines
	aws logs tail "$$($(OUT) log_group_name)" --region "$$($(OUT) region)" --follow

destroy:          ## Delete flag versions created by rollout.py, then everything Terraform created
	$(PY) scripts/rollout.py purge-versions
	$(TF) -chdir=$(TFDIR) destroy -var region=$(REGION)
