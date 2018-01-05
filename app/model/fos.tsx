import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IFos {
  id: number | null;
  fos: string | null;
}

export const initialFos: IFos = {
  id: null,
  fos: null,
};

export interface IFosRecord extends TypedRecord<IFosRecord>, IFos {}

export const FosFactory = makeTypedFactory<IFos, IFosRecord>(initialFos);
