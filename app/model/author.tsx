import { Affiliation } from "./affiliation";

export interface PaperAuthor {
  id: number;
  order: number;
  name: string;
  organization: string;
  is_layered: boolean;
  hindex: number;
  affiliation: Affiliation;
}
