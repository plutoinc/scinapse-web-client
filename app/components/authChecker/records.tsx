import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface AuthCheckerState {
  isLoading: boolean;
}

export interface AuthCheckerStateRecord extends TypedRecord<AuthCheckerStateRecord>, AuthCheckerState {}

const initialSignInState = {
  isLoading: true,
};

export const AuthCheckerStateFactory = makeTypedFactory<AuthCheckerState, AuthCheckerStateRecord>(initialSignInState);

export const AUTH_CHECKER_INITIAL_STATE = AuthCheckerStateFactory();
