import { TypedRecord, recordify } from "typed-immutable-record";
import { Affiliation, AffiliationRecord, initialAffiliation, AffiliationFactory } from "./affiliation";

export interface Author {
  id: number | null;
  order: number | null;
  name: string | null;
  organization: string | null;
  hindex: number | null;
  affiliation: Affiliation;
}

interface AuthorPart {
  id: number | null;
  order: number | null;
  name: string | null;
  organization: string | null;
  hindex: number | null;
  affiliation: AffiliationRecord;
}

export const initialAuthor: Author = {
  id: null,
  order: null,
  name: null,
  organization: null,
  hindex: null,
  affiliation: initialAffiliation,
};

export interface AuthorRecord extends TypedRecord<AuthorRecord>, AuthorPart {}

export const AuthorFactory = (rawAuthor: Author = initialAuthor): AuthorRecord => {
  return recordify({
    id: rawAuthor.id,
    order: rawAuthor.order,
    name: rawAuthor.name,
    organization: rawAuthor.organization,
    hindex: rawAuthor.hindex,
    affiliation: AffiliationFactory(rawAuthor.affiliation),
  });
};
