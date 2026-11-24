/* eslint-disable react/no-unescaped-entities -- Editorial prose; preserve publication wording. */
import type { Metadata } from 'next';
import { ArticleShell } from '../../components/ArticleShell';
import type { ArticleRecord } from '../../lib/articles';
import { PublicationVisual, type PublicationVisualContext } from '../../../src/components/publication';

const article: ArticleRecord = {
  id:'nbl-2026-11-24', title:'AI-DLC Meets Brownfield: Shipping AI-Built Changes Without Breaking Production', slug:'2026-11-ai-dlc-brownfield-feature-flags', issueDate:'2026-11-24',
  publishedAt:'2026-11-24T19:00:00-06:00', updatedAt:'2026-11-24T19:00:00-06:00',
  summary:'How to pair the AWS AI-Driven Development Lifecycle with AWS AppConfig feature flags so an AI agent can change a live application while people keep the release decision.',
  description:'A release-gate pattern for AI-built changes to existing applications, with Terraform and Python you can deploy to your own AWS account.',
  categories:['AI-Driven Development','Release Engineering'], topicTags:['AI-DLC','Feature flags','AWS AppConfig'], ataChapters:[],
  articleType:'Engineering Guide', estimatedReadingTime:14, publicationStatus:'published', featuredStatus:'featured',
  diagramIdentifiers:['feature-flag-release-gate'], referenceCount:7, relatedArticleSlugs:['2026-09-reliability-alert-latency'],
  previousArticleSlug:'2026-09-reliability-alert-latency', nextArticleSlug:null
};

const repo='https://github.com/ckoredla/CK_Docs/tree/main/blog/ai-dlc-meets-brownfield';
const file=(path:string)=>`https://github.com/ckoredla/CK_Docs/blob/main/blog/ai-dlc-meets-brownfield/${path}`;

export const metadata: Metadata = {title:article.title,description:article.description,alternates:{canonical:`/articles/${article.slug}`},openGraph:{type:'article',title:article.title,description:article.description,publishedTime:article.publishedAt,modifiedTime:article.updatedAt??article.publishedAt}};

const terraformExcerpt=`resource "aws_appconfig_environment" "prod" {
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
  name                           = "\${var.app_name}-linear-20pct-bake-10m"
  deployment_duration_in_minutes = 20
  growth_type                    = "LINEAR"
  growth_factor                  = 20
  final_bake_time_in_minutes     = 10
  replicate_to                   = "NONE"
}

# Turning OFF (kill switch): everyone at once, no bake.
resource "aws_appconfig_deployment_strategy" "immediate" {
  name                           = "\${var.app_name}-immediate-no-bake"
  deployment_duration_in_minutes = 0
  growth_type                    = "LINEAR"
  growth_factor                  = 100
  final_bake_time_in_minutes     = 0
  replicate_to                   = "NONE"
}`;

const seamExcerpt=`def handler(event, context=None):
    try:
        ticket = Ticket.from_event(event)
    except InvalidTicket as exc:
        return {"error": str(exc)}

    legacy = score_legacy(ticket)

    if not flag_enabled(FLAG):
        return legacy  # flag off: byte-for-byte the behavior users have today

    v2 = score_v2(ticket)
    emit_metrics(V2Evaluated=1, PriorityDisagreement=1 if disagrees(legacy, v2) else 0)
    return {**legacy, "v2": v2}`;

const agentRule=`# Brownfield release rule (team extension)

- Any change that alters user-visible behavior, outputs or stored data MUST be
  gated by an AWS AppConfig feature flag that defaults to disabled.
- Read the flag once, at the unit's entry point. Do not scatter flag checks.
- On flag-read failure, fall back to the legacy path.
- New outputs are additive. Never overwrite legacy fields while the flag exists.
- Every unit of work lists: flag name, owner, default, rollout plan, removal date.
- Tests MUST cover both flag states. The flag-off suite is a required CI check.
- Never change a flag value or deployment from the agent session.
  Flag rollouts are human decisions.`;

const walkthrough=`git clone https://github.com/ckoredla/CK_Docs.git
cd CK_Docs/blog/ai-dlc-meets-brownfield
make setup          # Python venv + terraform init
make test           # 54 tests, no AWS account needed
make deploy         # terraform apply: 16 resources, flag OFF
make invoke         # legacy priority only
make enable         # you, the release owner: gradual rollout
make rollback-demo  # force the business alarm, watch AppConfig roll back
make destroy        # remove everything`;

export default function AiDlcBrownfieldFeatureFlagsPage(){
 const visualContext: PublicationVisualContext={slug:article.slug,title:article.title,domain:'AI-driven software delivery on AWS',tags:article.topicTags,ata:[],issueDate:article.issueDate,brief:'An AI agent builds new behavior behind an AWS AppConfig feature flag that ships off. A person starts a gradual rollout, CloudWatch alarms watch it, and AppConfig rolls the flag back automatically if an alarm fires.'};
 return <ArticleShell article={article}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.description,datePublished:article.publishedAt,dateModified:article.updatedAt,mainEntityOfPage:`https://northboundlabs.ai/articles/${article.slug}`,author:{'@type':'Person',name:'Chaitanya Koredla'},publisher:{'@type':'Organization',name:'Northbound Labs'}})}} />
  <div className="article-body">
   <p className="lead">Most AI-coding demos start from an empty repository. Most real work does not. Production applications carry years of business rules, downstream consumers, and people who act on their output every day. The useful question is not whether an agent can write a feature. It usually can. The question is how to let an agent change a system people rely on and still prove that nothing they depend on changed until someone decided it should.</p>
   <section><h2>Executive summary</h2><p>The AWS AI-Driven Development Lifecycle (AI-DLC) puts AI at the center of planning, design, and construction while people approve each phase. It gates the plan and the code. It does not, by itself, gate the moment new behavior first meets production traffic. A merged pull request is not a decision that users should see a change, and in a brownfield system those two events must stay separate.</p><p>AWS AppConfig feature flags close that gap. The pattern is three rules. The agent may only add behavior behind a flag that defaults to off. A code deployment with the flag off must be a no-op for users, which you can prove with tests. Turning the flag on is a human decision, rolled out gradually, watched by CloudWatch alarms, and reversible in seconds. In AI-DLC terms, flipping the flag becomes the final approval gate, owned by the Operations phase.</p></section>
   <PublicationVisual context={visualContext} role="hero"/>
   <section><h2>1. AI-DLC in brief</h2><p>AWS introduced AI-DLC as a methodology rather than a tool. The AI proposes plans, asks clarifying questions, and generates artifacts; people validate, decide, and own the outcome. Work moves through three phases. Inception turns intent into requirements and units of work, reviewed by the team in a ritual called Mob Elaboration. Construction produces the domain model, design, code, and tests, reviewed in Mob Construction. Operations covers deployment, observability, and running the change.</p><p>The workflow is open source as awslabs/aidlc-workflows under MIT-0, and version 2 runs natively in several agent harnesses, including Kiro, Claude Code, Codex CLI, Cursor, and GitHub Copilot. Two properties matter most for brownfield work. The workflow detects an existing codebase and scales its rigor to the change, so a small fix skips stages a new capability needs. And every plan, question, answer, and approval is written to files in the repository, which gives regulated teams an audit trail as valuable as the code.</p></section>
   <section><h2>2. The playbook, phase by phase</h2><p><strong>Inception: make the agent learn the system before it changes it.</strong> Start with a one- or two-sentence statement of intent and let the workflow ask the questions. Let reverse engineering run, then correct the agent's model of the existing code as a team, because every wrong assumption caught here is a defect you never ship. Write down the behavior that must not change; that list becomes the regression contract and the flag-off test suite. Name the flag in the requirements, with an owner, a default of off, and a removal date, so the agent designs for it instead of bolting it on.</p><p><strong>Construction: build both paths, test both paths.</strong> Read the flag once, at the entry point of the unit, and route to the new or legacy implementation. Never let the new path overwrite shared state while it is unproven; write its output beside the legacy result. Test the flag-off path as hard as the flag-on path and make that suite a required CI check. In Mob Construction, ask one question of every diff: with the flag off, can this change what a user sees?</p><p><strong>Operations: release is a separate, reversible decision.</strong> Deploy with the flag off and confirm that dashboards and the flag-off contract stay flat. Compare new and legacy outputs side by side before anyone acts on the new one. Roll out with an AppConfig deployment strategy that includes bake time, attach alarms on errors and a business-level signal, and let the alarm be the first responder. Once the new behavior is accepted, delete the flag and the legacy path.</p></section>
   <PublicationVisual context={visualContext} role="evidence"/>
   <section><h2>3. A generic use case you can run: Support Ticket Priority</h2><p>To make the pattern concrete, the companion project uses a deliberately generic brownfield change. A support platform sets every ticket's priority from the customer's tier alone, so an enterprise how-to question outranks a full outage for a standard customer. The new rule, built with AI-DLC, scores impact instead: tier, whether the service is down, how many users are affected, and how long the ticket has been open. Support teams, dashboards, and service-level agreements already depend on today's priority, which is exactly why the new rule must ship dark.</p><p>The infrastructure is plain Terraform with the AWS provider, so it fits existing pipelines and works with OpenTofu. This excerpt from <a href={file('terraform/appconfig.tf')}>terraform/appconfig.tf</a> tells the environment to watch two alarms and defines one strategy for turning the flag on and another for turning it off:</p>
    <pre className="article-code" tabIndex={0}><code>{terraformExcerpt}</code></pre>
    <p>Terraform owns the infrastructure and creates the flag in the off state; every later flag version comes from a person running the rollout script. Do not put the flag value in a Terraform variable, or a routine apply quietly becomes a release. Two details are easy to miss: the role AppConfig assumes needs <code>cloudwatch:DescribeAlarms</code>, and alarm actions must be enabled on each alarm or AppConfig will not roll back.</p></section>
   <section><h2>4. One seam that fails closed</h2><p>The Lambda function runs the AWS AppConfig Agent extension as a layer. Terraform reads the latest layer ARN from a public SSM parameter on every plan. The extension polls AppConfig every 15 seconds and serves cached flags on localhost, so reading a flag is a local HTTP call rather than an AWS API call. The handler in <a href={file('src/app.py')}>src/app.py</a> reads the flag once:</p>
    <pre className="article-code" tabIndex={0}><code>{seamExcerpt}</code></pre>
    <p>Four habits keep this safe. The flag is read in exactly one place. Any failure, including the extension being absent, means off. The v2 result sits beside the legacy fields instead of replacing them. And every v2 evaluation emits a PriorityDisagreement metric through CloudWatch Embedded Metric Format, which is the business signal the second alarm watches. Error rate and latency catch crashes; only a comparison between new and legacy output catches a rule that is quietly wrong.</p></section>
   <PublicationVisual context={visualContext} role="analysis"/>
   <section><h2>5. A rule that keeps the agent honest</h2><p>AI-DLC accepts team rules alongside the ones it ships. This short rule, kept in the repository next to the workflow's own rules, makes every generated plan and diff follow the pattern. The last line matters most: the agent can write the flag, but it never flips it.</p>
    <pre className="article-code" tabIndex={0}><code>{agentRule}</code></pre></section>
   <section><h2>6. Deploy it in your own AWS account</h2><p>The complete project lives in <a href={repo}>CK_Docs/blog/ai-dlc-meets-brownfield</a>, and every step is a make target. You need Terraform 1.5 or later (or OpenTofu), Python 3.13, AWS CLI v2, GNU Make, and credentials for an account you are allowed to experiment in. Everything deploys to us-east-1 unless you pass another Region. Plan on about an hour, most of it waiting for the gradual rollout.</p>
    <pre className="article-code" tabIndex={0}><code>{walkthrough}</code></pre>
    <p>With the flag off, a standard-tier ticket for a full outage affecting 250 users still lands in the P3 queue. After the rollout completes, the same request returns a v2 block that moves it to P1, beside the unchanged legacy fields. Turning the flag off uses an immediate strategy with no bake time. That is deliberate: AppConfig runs one deployment per environment at a time, and a 10-minute bake on the way down, like the predefined AllAtOnce strategy has, would block the next rollout. The project README includes a troubleshooting table and a six-step guide for adopting the same seam, tests, alarms, and agent rule in your own service.</p></section>
   <section><h2>7. Lessons and anti-patterns</h2><p>The reverse-engineering review is the highest-leverage meeting on a brownfield project, because the agent's model of a legacy system is confident and partly wrong. Write the must-not-change list before the agent writes code; without it, "no regressions" is a feeling. Treat flags as a design input rather than a deployment trick: named in the requirements, they produce one clean seam, while flags bolted on afterwards scatter conditionals across files. Remember that AppConfig rolls out per configuration fetch, not per user, so 20 percent of a deployment does not mean 20 percent of people.</p><p>The common failures mirror those lessons. An agent that edits legacy code in place makes every deploy a release with no fast way back. New logic that overwrites stored fields cannot be undone by rolling back the flag. A suite with only flag-on tests cannot prove that a deploy was a no-op. An agent session that can deploy configuration removes the very human gate the pattern exists to create. And flags that never die leave two code paths forever; put the removal date in the requirement.</p></section>
   <section><h2>Editorial note</h2><p>This article is independent engineering analysis. The Support Ticket Priority use case, its data, and its thresholds are generic examples written for this article and do not describe any employer's or customer's systems. AWS services are illustrative choices, not endorsements or requirements. Opinions are the author's own.</p></section>
   <section id="references"><h2>Sources</h2><ul>
    <li><a href="https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/">AWS DevOps Blog, AI-Driven Development Life Cycle: Reimagining Software Engineering</a></li>
    <li><a href="https://aws.amazon.com/blogs/devops/open-sourcing-adaptive-workflows-for-ai-driven-development-life-cycle-ai-dlc">AWS DevOps Blog, Open-Sourcing Adaptive Workflows for AI-DLC</a></li>
    <li><a href="https://github.com/awslabs/aidlc-workflows">awslabs/aidlc-workflows on GitHub</a></li>
    <li><a href="https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html">AWS AppConfig User Guide, What is AWS AppConfig?</a></li>
    <li><a href="https://docs.aws.amazon.com/appconfig/latest/userguide/monitoring-deployments.html">AWS AppConfig User Guide, Monitoring deployments for automatic rollback</a></li>
    <li><a href="https://aws.amazon.com/blogs/compute/implementing-dynamic-feature-flags-with-aws-appconfig-on-aws-lambda/">AWS Compute Blog, Implementing dynamic feature flags with AWS AppConfig on AWS Lambda</a></li>
    <li><a href="https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appconfig_environment">Terraform Registry, AWS provider AppConfig resources</a></li>
   </ul></section>
  </div>
 </ArticleShell>;
}
