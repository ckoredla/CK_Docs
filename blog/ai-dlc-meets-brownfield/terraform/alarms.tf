# The alarms AppConfig watches during every flag deployment.

resource "aws_cloudwatch_metric_alarm" "function_errors" {
  alarm_name          = "${var.app_name}-function-errors"
  alarm_description   = "Any function error during a flag rollout triggers rollback."
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  dimensions          = { FunctionName = aws_lambda_function.scoring.function_name }
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
}

# Business guardrail: if v2 moves too many tickets into a different queue than
# the legacy rule, the new logic needs review before it reaches more traffic.
resource "aws_cloudwatch_metric_alarm" "priority_disagreement" {
  alarm_name          = "${var.app_name}-priority-disagreement"
  alarm_description   = "Share of v2 evaluations whose priority differs from the legacy rule."
  namespace           = "SupportTicketPriority"
  metric_name         = "PriorityDisagreement"
  dimensions          = { Service = var.app_name }
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 1
  threshold           = var.disagreement_threshold
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
}
