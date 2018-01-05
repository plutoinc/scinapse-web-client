import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IPaperAuthor {
  order: number | null;
  name: string | null;
  organization: string | null;
  hIndex: number | null;
}

export const initialPaperAuthor: IPaperAuthor = {
  order: null,
  name: null,
  organization: null,
  hIndex: null,
};

export interface IPaperAuthorRecord extends TypedRecord<IPaperAuthorRecord>, IPaperAuthor {}

export const PaperAuthorFactory = makeTypedFactory<IPaperAuthor, IPaperAuthorRecord>(initialPaperAuthor);
