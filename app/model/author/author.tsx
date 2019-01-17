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
  is_email_hidden: boolean;
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
  isEmailHidden: boolean;
  fosList: NewFOS[];
}

export const authorSchema = new schema.Entity("authors");
export const authorListSchema = [authorSchema];
