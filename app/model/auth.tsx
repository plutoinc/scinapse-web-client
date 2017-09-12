import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ICurrentUser {
  email: string;
  memberId: number;
  nickName: string;
  password: string;
}

export interface ICurrentUserRecord extends TypedRecord<ICurrentUserRecord>, ICurrentUser {}

const initialCurrentUserState = {
  email: "",
  memberId: 0,
  nickName: "",
  password: "",
};

export const CurrentUserStateFactory = makeTypedFactory<ICurrentUser, ICurrentUserRecord>(initialCurrentUserState);

export const CURRENT_USER_INITIAL_STATE = CurrentUserStateFactory();
