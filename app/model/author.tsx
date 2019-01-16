import { Affiliation } from "./affiliation";

export interface BasePaperAuthor {
  id: number;
  name: string;
  is_layered: boolean;
  hindex: number;
}

export interface PaperAuthor extends BasePaperAuthor {
  order: number;
  organization: string;
  affiliation: Affiliation;
}
