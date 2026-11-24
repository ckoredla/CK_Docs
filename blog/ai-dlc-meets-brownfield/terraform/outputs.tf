# scripts/rollout.py and the Makefile read these with `terraform output`.

output "region" {
  value = var.region
}

output "function_name" {
  value = aws_lambda_function.scoring.function_name
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.function.name
}

output "application_id" {
  value = aws_appconfig_application.flags.id
}

output "environment_id" {
  value = aws_appconfig_environment.prod.environment_id
}

output "configuration_profile_id" {
  value = aws_appconfig_configuration_profile.flags.configuration_profile_id
}

output "gradual_strategy_id" {
  value = aws_appconfig_deployment_strategy.gradual.id
}

output "immediate_strategy_id" {
  value = aws_appconfig_deployment_strategy.immediate.id
}

output "disagreement_alarm_name" {
  value = aws_cloudwatch_metric_alarm.priority_disagreement.alarm_name
}
