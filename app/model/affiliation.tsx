import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface Affiliation {
  id: number | null;
  name: string | null;
}

export const initialAffiliation: Affiliation = {
  id: null,
  name: null,
};

export interface AffiliationRecord extends TypedRecord<AffiliationRecord>, Affiliation {}

export const AffiliationFactory = makeTypedFactory<Affiliation, AffiliationRecord>(initialAffiliation);
