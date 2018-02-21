import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface AuthCheckerState {
  isLoading: boolean;
}

export interface AuthCheckerStateRecord extends TypedRecord<AuthCheckerStateRecord>, AuthCheckerState {}

export const initialAuthCheckerState = {
  isLoading: true,
};

export const AuthCheckerStateFactory = makeTypedFactory<AuthCheckerState, AuthCheckerStateRecord>(
  initialAuthCheckerState,
);

export const AUTH_CHECKER_INITIAL_STATE = AuthCheckerStateFactory();
