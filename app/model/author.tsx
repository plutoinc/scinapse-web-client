import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { Affiliation, AffiliationRecord, initialAffiliation, AffiliationFactory } from "./affiliation";

export interface PaperAuthor {
  id: number | null;
  order: number | null;
  name: string | null;
  organization: string | null;
  hindex: number | null;
  affiliation: Affiliation;
}

interface PaperAuthorPart {
  id: number | null;
  order: number | null;
  name: string | null;
  organization: string | null;
  hindex: number | null;
  affiliation: AffiliationRecord;
}

export const initialPaperAuthor: PaperAuthor = {
  id: null,
  order: null,
  name: null,
  organization: null,
  hindex: null,
  affiliation: initialAffiliation,
};

export interface PaperAuthorRecord extends TypedRecord<PaperAuthorRecord>, PaperAuthorPart {}

export const PaperAuthorListFactory = (rawAuthors: PaperAuthor[] = []): List<PaperAuthorRecord> => {
  const authors = rawAuthors.map(rawAuthor => PaperAuthorFactory(rawAuthor));
  return List(authors);
};

export const PaperAuthorFactory = (rawAuthor: PaperAuthor = initialPaperAuthor): PaperAuthorRecord => {
  if (rawAuthor) {
    return recordify({
      id: rawAuthor.id,
      order: rawAuthor.order,
      name: rawAuthor.name,
      organization: rawAuthor.organization,
      hindex: rawAuthor.hindex,
      affiliation: AffiliationFactory(rawAuthor.affiliation),
    });
  }
};
