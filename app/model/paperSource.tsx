import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IPaperSource {
  id: number;
  paperId: number;
  url: string;
}

export const initialPaperSource: IPaperSource = {
  id: 0,
  paperId: 0,
  url: "",
};

export interface IPaperSourceRecord extends TypedRecord<IPaperSourceRecord>, IPaperSource {}

export const PaperSourceFactory = makeTypedFactory<IPaperSource, IPaperSourceRecord>(initialPaperSource);
