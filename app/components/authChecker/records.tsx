import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IAuthCheckerState {
  isLoading: boolean;
}

export interface IAuthCheckerStateRecord extends TypedRecord<IAuthCheckerStateRecord>, IAuthCheckerState {}

const initialSignInState = {
  isLoading: true,
};

export const AuthCheckFactory = makeTypedFactory<IAuthCheckerState, IAuthCheckerStateRecord>(initialSignInState);

export const AUTH_CHECKER_INITIAL_STATE = AuthCheckFactory();
