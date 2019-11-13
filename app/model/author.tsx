import { Affiliation } from './affiliation';

export interface BasePaperAuthor {
  id: string;
  name: string;
  isLayered: boolean;
  hindex?: number;
}

export interface PaperAuthor extends BasePaperAuthor {
  order: number;
  organization: string;
  affiliation: Affiliation | null;
}
