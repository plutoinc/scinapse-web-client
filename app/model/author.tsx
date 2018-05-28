import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { Affiliation, AffiliationRecord, initialAffiliation, AffiliationFactory } from "./affiliation";

export interface PaperAuthor {
  id: number;
  order: number;
  name: string;
  organization: string;
  hindex: number;
  affiliation: Affiliation;
}

interface PaperAuthorPart {
  id: number;
  order: number;
  name: string;
  organization: string;
  hindex: number;
  affiliation: AffiliationRecord;
}

export const initialPaperAuthor: PaperAuthor = {
  id: 0,
  order: 0,
  name: "",
  organization: "",
  hindex: 0,
  affiliation: initialAffiliation,
};

export interface PaperAuthorRecord extends TypedRecord<PaperAuthorRecord>, PaperAuthorPart {}

export const PaperAuthorListFactory = (rawAuthors: PaperAuthor[] = []): List<PaperAuthorRecord> => {
  const authors = rawAuthors.map(rawAuthor => PaperAuthorFactory(rawAuthor));
  return List(authors);
};

export const PaperAuthorFactory = (rawAuthor: PaperAuthor = initialPaperAuthor): PaperAuthorRecord => {
  return recordify({
    id: rawAuthor.id,
    order: rawAuthor.order,
    name: rawAuthor.name,
    organization: rawAuthor.organization,
    hindex: rawAuthor.hindex,
    affiliation: AffiliationFactory(rawAuthor.affiliation),
  });
};
