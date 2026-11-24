variable "region" {
  description = "AWS Region to deploy into. The AppConfig Agent Lambda extension must be published there."
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Prefix for every resource name."
  type        = string
  default     = "support-ticket-priority"
}

variable "env_name" {
  description = "AppConfig environment name."
  type        = string
  default     = "prod"
}

variable "profile_name" {
  description = "AppConfig feature-flag configuration profile name."
  type        = string
  default     = "release-flags"
}

variable "disagreement_threshold" {
  description = "Roll back the flag if more than this share of v2 evaluations put a ticket in a different priority than the legacy rule within 5 minutes."
  type        = number
  default     = 0.5
}
