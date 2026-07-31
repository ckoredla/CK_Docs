import Image from 'next/image';
import { VisualFrame, short } from '../Frame';
import type { FamilyProps } from '../types';

function Service({icon,name,role}:{icon:string;name:string;role:string}){return <div className="pv-aws-service"><Image src={`/aws-icons/${icon}.svg`} alt="" width={42} height={42}/><span><b>{name}</b><small>{role}</small></span></div>}
function Connector({label,tone='request'}:{label:string;tone?:'request'|'event'|'failure'}){return <div className="pv-aws-connector" data-tone={tone}><small>{label}</small><i>→</i></div>}

export function AwsArchitectureCanvas(props:FamilyProps){
  const subject=short(props.domain,44);const signal=props.tags[0]||'maintenance event';
  return <VisualFrame family="aws-architecture" props={props} caption="Conceptual AWS reference architecture: service selection, security controls, recovery objectives, throughput, retention, and regulatory applicability require workload-specific validation.">
    <div className="pv-aws-architecture" role="img" aria-label={`Conceptual AWS architecture for ${props.domain}, showing the airline environment, an AWS Region, synchronous intake, asynchronous coordination, evidence stores, human authorization, system-of-record integration, failure recovery, security, and observability.`}>
      <section className="pv-aws-external"><header>Airline / MRO environment</header><article><b>Operational user</b><small>{subject}</small></article><article><b>Qualified reviewer</b><small>inspect · decide · record</small></article><article><b>System of record</b><small>controlled maintenance update</small></article></section>
      <div className="pv-aws-entry"><Connector label="authenticated request"/></div>
      <section className="pv-aws-region"><header><b>AWS Region</b><small>conceptual workload boundary</small></header><div className="pv-aws-stages">
        <section><em>1 · INTAKE</em><Service icon="api-gateway" name="Amazon API Gateway" role="authenticated API boundary"/><Connector label="validate + authorize"/><Service icon="lambda" name="AWS Lambda" role="command adapter · idempotency"/></section>
        <section><em>2 · COORDINATE</em><Service icon="eventbridge" name="Amazon EventBridge" role={`${signal} domain events`}/><Connector label="domain event" tone="event"/><Service icon="step-functions" name="AWS Step Functions" role="durable workflow · review wait"/></section>
        <section><em>3 · RETAIN</em><Service icon="dynamodb" name="Amazon DynamoDB" role="case state · idempotency"/><Service icon="s3" name="Amazon S3" role="immutable evidence objects"/><Service icon="lambda" name="AWS Lambda" role="context and evidence resolver"/></section>
        <section><em>4 · INTEGRATE</em><Service icon="sqs" name="Amazon SQS" role="system command buffer"/><Connector label="bounded retry" tone="event"/><Service icon="lambda" name="AWS Lambda" role="MRO boundary adapter"/><div className="pv-aws-failure"><Connector label="failed message" tone="failure"/><b>Dead-letter queue · inspect · redrive</b></div></section>
      </div><div className="pv-aws-authority"><b>HUMAN AUTHORITY GATE</b><span>Automation assembles and routes evidence; qualified personnel authorize maintenance action.</span></div><aside><b>WORKLOAD CONTROLS</b><Service icon="cloudwatch" name="Amazon CloudWatch" role="logs · metrics · alarms"/><Service icon="x-ray" name="AWS X-Ray" role="distributed traces"/><Service icon="cloudtrail" name="AWS CloudTrail" role="control-plane audit"/><Service icon="kms" name="AWS KMS" role="encryption keys"/></aside></section>
      <ol><li><b>Fast acknowledgement</b><span>Return a case identifier without holding the user request open for enrichment.</span></li><li><b>Explicit authority</b><span>Pause workflow at the accountable operational decision.</span></li><li><b>Failure isolation</b><span>Buffer system-of-record outages and retain failed commands for controlled replay.</span></li><li><b>End-to-end trace</b><span>Carry one correlation ID across request, event, evidence, decision, and record.</span></li></ol>
    </div>
  </VisualFrame>
}
