import { schema } from "normalizr";
import { Paper } from "../paper";
import { Affiliation } from "../affiliation";

export interface RawAuthor {
  id: number;
  name: string;
  hindex: number;
  last_known_affiliation: Affiliation;
  paper_count: number;
  citation_count: number;
  bio: string | null;
  is_profile_connected: boolean;
  profile_id: string | null;
  selected_papers: Paper[];
  top_papers: Paper[];
}

export interface Author {
  id: number;
  name: string;
  hIndex: number;
  lastKnownAffiliation?: Affiliation;
  paperCount: number;
  citationCount: number;
  bio: string | null;
  isProfileConnected: boolean;
  profileId: string | null;
  selectedPapers: Paper[];
  topPapers: Paper[];
}

export const authorSchema = new schema.Entity("authors");
export const authorListSchema = [authorSchema];
