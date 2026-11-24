# AWS AppConfig: the application, the release flag (OFF), the environment that
# watches the alarms, and the two rollout strategies.

resource "aws_appconfig_application" "flags" {
  name = var.app_name
}

resource "aws_appconfig_configuration_profile" "flags" {
  application_id = aws_appconfig_application.flags.id
  name           = var.profile_name
  location_uri   = "hosted"
  type           = "AWS.AppConfig.FeatureFlags"
}

# Flags version 1: the new priority logic exists in code but is OFF.
# Later versions are created by scripts/rollout.py, which a person runs.
resource "aws_appconfig_hosted_configuration_version" "flags_off" {
  application_id           = aws_appconfig_application.flags.id
  configuration_profile_id = aws_appconfig_configuration_profile.flags.configuration_profile_id
  content_type             = "application/json"
  content                  = file("${path.module}/release-flags-v1.json")
  description              = "Initial version: new_priority_scoring off"
}

resource "aws_appconfig_environment" "prod" {
  application_id = aws_appconfig_application.flags.id
  name           = var.env_name

  # If either alarm fires during a flag deployment, AppConfig rolls it back.
  monitor {
    alarm_arn      = aws_cloudwatch_metric_alarm.function_errors.arn
    alarm_role_arn = aws_iam_role.appconfig_alarms.arn
  }

  monitor {
    alarm_arn      = aws_cloudwatch_metric_alarm.priority_disagreement.arn
    alarm_role_arn = aws_iam_role.appconfig_alarms.arn
  }
}

# Turning ON: 20% more Lambda execution environments every 4 minutes,
# then 10 minutes of bake time while the alarms watch.
resource "aws_appconfig_deployment_strategy" "gradual" {
  name                           = "${var.app_name}-linear-20pct-bake-10m"
  deployment_duration_in_minutes = 20
  growth_type                    = "LINEAR"
  growth_factor                  = 20
  final_bake_time_in_minutes     = 10
  replicate_to                   = "NONE"
}

# Turning OFF (kill switch) and the first deployment: everyone at once, no bake.
# AppConfig runs one deployment per environment at a time, so a bake here
# would block the next rollout.
resource "aws_appconfig_deployment_strategy" "immediate" {
  name                           = "${var.app_name}-immediate-no-bake"
  deployment_duration_in_minutes = 0
  growth_type                    = "LINEAR"
  growth_factor                  = 100
  final_bake_time_in_minutes     = 0
  replicate_to                   = "NONE"
}

# Deploy the "all off" flags so the function has a value to read from day one.
resource "aws_appconfig_deployment" "initial" {
  application_id           = aws_appconfig_application.flags.id
  environment_id           = aws_appconfig_environment.prod.environment_id
  configuration_profile_id = aws_appconfig_configuration_profile.flags.configuration_profile_id
  configuration_version    = tostring(aws_appconfig_hosted_configuration_version.flags_off.version_number)
  deployment_strategy_id   = aws_appconfig_deployment_strategy.immediate.id
  description              = "Initial deployment: all release flags off"
}

# The role AppConfig assumes to read alarm state during deployments.
data "aws_iam_policy_document" "appconfig_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["appconfig.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "read_alarms" {
  statement {
    actions   = ["cloudwatch:DescribeAlarms"]
    resources = ["*"]
  }
}

resource "aws_iam_role" "appconfig_alarms" {
  name               = "${var.app_name}-appconfig-alarms"
  assume_role_policy = data.aws_iam_policy_document.appconfig_assume.json
}

resource "aws_iam_role_policy" "appconfig_alarms" {
  name   = "read-alarms"
  role   = aws_iam_role.appconfig_alarms.id
  policy = data.aws_iam_policy_document.read_alarms.json
}
