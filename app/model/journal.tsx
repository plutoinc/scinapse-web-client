import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IJournal {
  id: number | null;
  impactFactor: number | null;
  fullTitle: string | null;
}

export const initialJournal: IJournal = {
  id: null,
  impactFactor: null,
  fullTitle: null,
};

export interface IJournalRecord extends TypedRecord<IJournalRecord>, IJournal {}

export const JournalFactory = makeTypedFactory<IJournal, IJournalRecord>(initialJournal);
