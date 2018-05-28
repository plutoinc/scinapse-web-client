import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface Fos {
  id: number | null;
  fos: string | null;
}

export const initialFos: Fos = {
  id: null,
  fos: null,
};

export interface FosRecord extends TypedRecord<FosRecord>, Fos {}

export const FosFactory = makeTypedFactory<Fos, FosRecord>(initialFos);
