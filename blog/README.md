# Blog articles

One folder per article. Each folder holds the article itself (`article.md`) and the code that goes with it, which you can deploy to your own AWS account. Infrastructure is written in Terraform (OpenTofu works too), and every folder is tested in GitHub Actions by `.github/workflows/blog-code.yml`.

| Article | Use case | Built with |
| --- | --- | --- |
| [AI-DLC Meets Brownfield: Shipping AI-Built Changes Without Breaking Production](ai-dlc-meets-brownfield/) | Support Ticket Priority | Terraform, Python 3.13, AWS Lambda, AWS AppConfig feature flags, Amazon CloudWatch |
