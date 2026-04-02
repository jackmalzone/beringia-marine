export interface SolutionMedia {
  images: Array<{
    src: string;
    alt: string;
  }>;
  videos?: Array<{
    src: string;
    title: string;
  }>;
  sketchfab?: {
    modelId: string;
    title: string;
  };
}

export interface SolutionMediaPlan {
  imageStatus: 'ready' | 'placeholder';
  videoStatus: 'none' | 'pending' | 'ready';
  sketchfabStatus: 'none' | 'pending' | 'ready';
  documentationStatus: 'pending' | 'partial' | 'linked';
  notes?: string[];
}

export interface SolutionExternalLink {
  label: string;
  href: string;
}

export interface SolutionDocument {
  label: string;
  href: string;
}

export interface SolutionSEO {
  title: string;
  description: string;
  ogImage?: string;
}

export interface Solution {
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  capabilities: string[];
  valueProposition: string[];
  applications: string[];
  deploymentContexts: string[];
  strategicAdvantages: string[];
  commercializationSupport: string[];
  media: SolutionMedia;
  mediaPlan: SolutionMediaPlan;
  externalLinks: SolutionExternalLink[];
  documentation?: SolutionDocument[];
  seo: SolutionSEO;
}
