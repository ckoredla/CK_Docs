export type VisualVariant = 'a' | 'b' | 'c';
export type VisualRole = 'hero' | 'evidence' | 'analysis' | 'decision';
export type PublicationMode = 'research' | 'briefing' | 'handbook' | 'field-guide' | 'technical-manual' | 'playbook' | 'decision-record' | 'case-study';

export type PublicationVisualContext = {
  slug: string;
  title: string;
  domain: string;
  tags: string[];
  ata: string[];
  issueDate: string;
  brief?: string;
};

export type FamilyProps = PublicationVisualContext & {
  role: VisualRole;
  variant: VisualVariant;
  question: string;
  profile: string;
};
