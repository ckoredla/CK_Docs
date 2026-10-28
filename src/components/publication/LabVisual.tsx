import {
  PremiumAircraft,
  PremiumArchitecture,
  PremiumBlueprint,
  PremiumDecisionTree,
  PremiumKnowledge,
  PremiumTable,
  PremiumTimeline,
  PremiumTopology
} from './Premium';
import type { FamilyProps } from './types';
import { visualSelection } from './catalog';

/** Legacy `lab-*` keys describe an information need, not a fixed picture. */
export function LaboratoryVisual(props:FamilyProps&{family:string}){
  const Figure=(()=>{
    // Roles deliberately use different information models inside one article.
    // This prevents a four-figure article becoming the same composition with
    // different labels while keeping the chosen hero family topic-specific.
    const heroFamily=visualSelection(props,'hero')?.family;
    const heroCanvas=heroFamily==='lab-defect-lifecycle'?'knowledge-graph':heroFamily==='lab-parts-network'?'topology':heroFamily==='lab-reliability'||heroFamily==='lab-telemetry-sequence'?'timeline':heroFamily==='lab-observability'?'table':heroFamily==='lab-maintenance-swimlane'||heroFamily==='lab-work-package'?'service-blueprint':heroFamily==='lab-aircraft-system'?'aircraft':'architecture';
    if(props.role==='evidence')return heroCanvas==='timeline'?PremiumTable:PremiumTimeline;
    if(props.role==='analysis')return heroCanvas==='knowledge-graph'?PremiumTopology:heroCanvas==='topology'||heroCanvas==='table'||heroCanvas==='timeline'?PremiumKnowledge:PremiumTable;
    if(props.role==='decision')return PremiumDecisionTree;
    switch(props.family){
      case 'lab-ai-authority':return props.profile==='knowledge-assistance'?PremiumKnowledge:PremiumArchitecture;
      case 'lab-aircraft-system':return PremiumAircraft;
      case 'lab-defect-lifecycle':return PremiumKnowledge;
      case 'lab-maintenance-swimlane':return PremiumBlueprint;
      case 'lab-observability':return PremiumTable;
      case 'lab-parts-network':return PremiumTopology;
      case 'lab-reliability':return PremiumTimeline;
      case 'lab-telemetry-architecture':return PremiumArchitecture;
      case 'lab-telemetry-sequence':return PremiumTimeline;
      case 'lab-work-package':return PremiumBlueprint;
      default:return null;
    }
  })();
  if(!Figure)return null;
  return <section className="article-lab-visual article-contextual-visual" data-source-family={props.family} data-visual-article={props.slug}><Figure {...props}/></section>;
}
