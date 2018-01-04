import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IPaperSource {
  id: number | null;
  paperId: number | null;
  url: string | null;
}

export const initialPaperSource: IPaperSource = {
  id: null,
  paperId: null,
  url: null,
};

export interface IPaperSourceRecord extends TypedRecord<IPaperSourceRecord>, IPaperSource {}

export const PaperSourceFactory = makeTypedFactory<IPaperSource, IPaperSourceRecord>(initialPaperSource);
