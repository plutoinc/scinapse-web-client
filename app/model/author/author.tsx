import { schema } from "normalizr";
import { Paper } from "../paper";
import { Affiliation } from "../affiliation";
import { NewFOS } from "../fos";

export interface RawAuthor {
  id: number;
  name: string;
  hindex: number;
  last_known_affiliation: Affiliation;
  paper_count: number;
  citation_count: number;
  bio: string | null;
  representative_papers: Paper[];
  top_papers: Paper[];
  email: string;
  web_page: string | null;
  profile_image_url: string | null;
  is_layered: boolean;
  fos_list: NewFOS[];
}

export interface Author {
  id: number;
  name: string;
  hIndex: number;
  lastKnownAffiliation?: Affiliation;
  paperCount: number;
  citationCount: number;
  bio: string | null;
  representativePapers: Paper[];
  topPapers: Paper[];
  email: string;
  webPage: string | null;
  profileImageUrl: string | null;
  isLayered: boolean;
  fosList: NewFOS[];
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
    representativePapers: rawAuthor.representative_papers,
    topPapers: rawAuthor.top_papers,
    email: rawAuthor.email,
    webPage: rawAuthor.web_page,
    profileImageUrl: rawAuthor.profile_image_url,
    isLayered: rawAuthor.is_layered,
    fosList: rawAuthor.fos_list,
  };
}

export const authorSchema = new schema.Entity("authors");
export const authorListSchema = [authorSchema];
