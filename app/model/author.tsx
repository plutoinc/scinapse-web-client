import { Affiliation } from './affiliation';
import { Profile } from './profile';

export interface BasePaperAuthor {
  id: string;
  name: string;
  isLayered: boolean;
  profile: Profile | null;
  hindex?: number;
}

export interface PaperAuthor extends BasePaperAuthor {
  order: number;
  organization: string;
  affiliation: Affiliation | null;
}
