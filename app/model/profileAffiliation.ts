import { Domain } from "./domain";

export type ProfileAffiliation = {
  id: string;
  name: string;
  nameAbbrev: string | null;
  officialPage: string | null;
  paperCount: number | null;
  citationCount: number | null;
  wikiPage: string | null;
  domains: Domain[];
}