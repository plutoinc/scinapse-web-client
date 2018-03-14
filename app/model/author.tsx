import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IAuthor {
  order: number | null;
  name: string | null;
  organization: string | null;
  hindex: number | null;
}

export const initialAuthor: IAuthor = {
  order: null,
  name: null,
  organization: null,
  hindex: null,
};

export interface IAuthorRecord extends TypedRecord<IAuthorRecord>, IAuthor {}

export const AuthorFactory = makeTypedFactory<IAuthor, IAuthorRecord>(initialAuthor);
