import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ICurrentUser {
  email: string;
  memberId: number;
  nickName: string;
  password: string;
}

export interface ICurrentUserRecord extends TypedRecord<ICurrentUserRecord>, ICurrentUser {}

const initialCurrentUser = {
  email: "",
  memberId: 0,
  nickName: "",
  password: "",
};

export const CurrentUserFactory = makeTypedFactory<ICurrentUser, ICurrentUserRecord>(initialCurrentUser);

export const CURRENT_USER_INITIAL_STATE = CurrentUserFactory();
