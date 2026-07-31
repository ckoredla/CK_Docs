import type { ReactNode } from 'react';
import type { FamilyProps } from './types';

const roleLabel = { hero: 'System view', evidence: 'Evidence view', analysis: 'Analytical view', decision: 'Decision view' };

export function VisualFrame({ family, props, children, caption }: { family: string; props: FamilyProps; children: ReactNode; caption: string }) {
  return <figure id={`visual-${props.role}-${family}`} className={`publication-visual pv-family-${family} pv-${props.variant}`} data-visual-family={family} data-visual-variant={props.variant} data-visual-profile={props.profile} data-visual-question={props.question}>
    <header><span>{roleLabel[props.role]} · {family.replaceAll('-', ' ')}</span><div><h3>{props.title}</h3><p>{props.question}</p></div></header>
    <div className="pv-canvas">{children}</div><figcaption>{caption}</figcaption>
  </figure>;
}

export const short = (value: string, length = 34) => value.length > length ? `${value.slice(0, length - 1)}…` : value;
export const numbered = (items: string[]) => items.map((item, index) => ({ item, n: String(index + 1).padStart(2, '0') }));
