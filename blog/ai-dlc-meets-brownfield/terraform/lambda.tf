# The brownfield function: one flag seam between legacy and v2 priority.

data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}

# Latest AWS AppConfig Agent Lambda extension (x86_64), published by AWS as a
# public SSM parameter. Resolved on every plan, so you never hard-code a version.
data "aws_ssm_parameter" "appconfig_extension" {
  name = "/aws/service/aws-appconfig/lambda-extension/x86/latest"
}

data "archive_file" "function" {
  type        = "zip"
  source_dir  = "${path.module}/../src"
  output_path = "${path.module}/build/function.zip"
  excludes    = ["__pycache__"]
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# The extension needs these two calls to fetch flags for this application only.
data "aws_iam_policy_document" "read_release_flags" {
  statement {
    actions = [
      "appconfig:StartConfigurationSession",
      "appconfig:GetLatestConfiguration",
    ]
    resources = [
      "arn:${data.aws_partition.current.partition}:appconfig:${var.region}:${data.aws_caller_identity.current.account_id}:application/${aws_appconfig_application.flags.id}/*",
    ]
  }
}

resource "aws_iam_role" "function" {
  name               = "${var.app_name}-scoring"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "function_logs" {
  role       = aws_iam_role.function.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "function_appconfig" {
  name   = "read-release-flags"
  role   = aws_iam_role.function.id
  policy = data.aws_iam_policy_document.read_release_flags.json
}

resource "aws_cloudwatch_log_group" "function" {
  name              = "/aws/lambda/${var.app_name}-scoring"
  retention_in_days = 14
}

# Names, not IDs, in the environment variables: the extension accepts either,
# and names keep the function independent of the AppConfig environment.
resource "aws_lambda_function" "scoring" {
  function_name    = "${var.app_name}-scoring"
  role             = aws_iam_role.function.arn
  runtime          = "python3.13"
  architectures    = ["x86_64"]
  handler          = "app.handler"
  filename         = data.archive_file.function.output_path
  source_code_hash = data.archive_file.function.output_base64sha256
  timeout          = 10
  memory_size      = 256
  layers           = [data.aws_ssm_parameter.appconfig_extension.insecure_value]

  environment {
    variables = {
      APPCONFIG_APPLICATION                         = var.app_name
      APPCONFIG_ENVIRONMENT                         = var.env_name
      APPCONFIG_PROFILE                             = var.profile_name
      METRIC_NAMESPACE                              = "SupportTicketPriority"
      SERVICE_NAME                                  = var.app_name
      AWS_APPCONFIG_EXTENSION_POLL_INTERVAL_SECONDS = "15"
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.function,
    aws_iam_role_policy_attachment.function_logs,
  ]
}
