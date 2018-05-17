import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";
import { List } from "immutable";

interface LastKnownAffiliation {
  id: number | undefined;
  name: string | undefined;
}

const initialLastKnownAffiliation: LastKnownAffiliation = {
  id: undefined,
  name: undefined,
};

export interface LastKnownAffiliationRecord extends TypedRecord<LastKnownAffiliationRecord>, LastKnownAffiliation {}

export const LastKnownAffiliationFactory = makeTypedFactory<LastKnownAffiliation, LastKnownAffiliationRecord>(
  initialLastKnownAffiliation,
);

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

interface InnerRecordifiedAuthor {
  id: number;
  name: string;
  hIndex: number;
  lastKnownAffiliation: LastKnownAffiliationRecord;
  paperCount: number;
  citationCount: number;
}

export interface AuthorRecord extends TypedRecord<AuthorRecord>, InnerRecordifiedAuthor {}

const initialAuthor: Author = {
  id: undefined,
  name: undefined,
  hIndex: undefined,
  lastKnownAffiliation: undefined,
  paperCount: undefined,
  citationCount: undefined,
};

export const AuthorFactory = (rawAuthor: Author = initialAuthor): AuthorRecord => {
  if (rawAuthor) {
    return recordify({
      id: rawAuthor.id,
      name: rawAuthor.name,
      hIndex: rawAuthor.hIndex,
      lastKnownAffiliation: LastKnownAffiliationFactory(rawAuthor.lastKnownAffiliation),
      paperCount: rawAuthor.paperCount,
      citationCount: rawAuthor.citationCount,
    });
  }
};

export const AuthorListFactory = (rawAuthors: Author[] = []): List<AuthorRecord> => {
  const authors = rawAuthors.map(author => AuthorFactory(author));
  return List(authors);
};
