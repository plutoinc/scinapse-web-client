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
  selectedPapers: Paper[];
  topPapers: Paper[];
}

export function mapRawAuthor(rawAuthor: RawAuthor): Author {
  return {
    id: rawAuthor.id,
    name: rawAuthor.name,
    hIndex: rawAuthor.hindex,
    lastKnownAffiliation: rawAuthor.last_known_affiliation,
    paperCount: rawAuthor.paper_count,
    citationCount: rawAuthor.citation_count,
    bio: rawAuthor.bio,
    selectedPapers: rawAuthor.selected_papers,
    topPapers: rawAuthor.top_papers,
  };
}

export const authorSchema = new schema.Entity("authors");
export const authorListSchema = [authorSchema];
