import type { Metadata } from 'next';
import { AwsServerlessMroArchitecture } from '../../../src/components/visual-lab/AwsServerlessMroArchitecture';
import '../visual-lab.css';

export const metadata:Metadata={title:'AWS Serverless MRO Architecture | Visual Lab',robots:{index:false,follow:false}};

export default function AwsVisualLab(){return <main className="visual-lab"><header className="lab-hero aws-review-hero"><span>Northbound Labs · AWS architecture review</span><h1>Serverless MRO reference pattern</h1><p>The isolated review surface for the maintenance-discrepancy architecture used by relevant cloud publication articles.</p></header><AwsServerlessMroArchitecture/></main>}
