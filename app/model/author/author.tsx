interface LastKnownAffiliation {
  id: number | undefined;
  name: string | undefined;
}

export interface RawAuthorResponse {
  id: number;
  name: string;
  hindex: number;
  last_known_affiliation: LastKnownAffiliation;
  paper_count: number;
  citation_count: number;
}

export interface Author {
  id: number;
  name: string;
  hIndex: number;
  lastKnownAffiliation: LastKnownAffiliation;
  paperCount: number;
  citationCount: number;
}
