import type { ComponentType } from 'react';
import {
  AiDecisionArchitecture,
  ApuFunctionalArchitecture,
  ChronicDefectLifecycle,
  MaintenanceControlSwimlane,
  ObservabilityDashboard,
  PartsRotablesNetwork,
  ReliabilityAnalysis,
  TelemetryReferenceArchitecture,
  TelemetrySequence,
  WorkPackageLifecycle
} from '../visual-lab/ShowcaseFigures';
import type { FamilyProps } from './types';

const figures:Record<string,ComponentType>={
  'lab-ai-authority':AiDecisionArchitecture,
  'lab-aircraft-system':ApuFunctionalArchitecture,
  'lab-defect-lifecycle':ChronicDefectLifecycle,
  'lab-maintenance-swimlane':MaintenanceControlSwimlane,
  'lab-observability':ObservabilityDashboard,
  'lab-parts-network':PartsRotablesNetwork,
  'lab-reliability':ReliabilityAnalysis,
  'lab-telemetry-architecture':TelemetryReferenceArchitecture,
  'lab-telemetry-sequence':TelemetrySequence,
  'lab-work-package':WorkPackageLifecycle
};

export function LaboratoryVisual(props:FamilyProps&{family:string}){
  const Figure=figures[props.family];
  if(!Figure)return null;
  return <section className="article-lab-visual" data-visual-family={props.family} data-visual-profile={props.profile} data-visual-variant={props.variant} data-visual-question={props.question}><Figure/></section>;
}
