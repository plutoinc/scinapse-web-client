import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IJournal {
  impactFactor: number | null;
  fullTitle: string | null;
  id: number | null;
}

export const initialJournal: IJournal = {
  impactFactor: null,
  fullTitle: null,
  id: null,
};

export interface IJournalRecord extends TypedRecord<IJournalRecord>, IJournal {}

export const JournalFactory = makeTypedFactory<IJournal, IJournalRecord>(initialJournal);
