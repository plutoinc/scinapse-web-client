import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IAuthCheckerState {
  isLoading: boolean;
}

export interface IAuthCheckerStateRecord extends TypedRecord<IAuthCheckerStateRecord>, IAuthCheckerState {}

const initialSignInState = {
  isLoading: true,
};

export const AuthCheckerStateFactory = makeTypedFactory<IAuthCheckerState, IAuthCheckerStateRecord>(initialSignInState);

export const AUTH_CHECKER_INITIAL_STATE = AuthCheckerStateFactory();
