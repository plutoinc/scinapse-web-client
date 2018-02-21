import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export enum SIGN_IN_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
}

export interface SignInState {
  isLoading: boolean;
  isFailed: boolean;
  hasError: boolean;
  email: string;
  password: string;
  onFocus: SIGN_IN_ON_FOCUS_TYPE | null;
  isNotUnsignedUpWithSocial: boolean;
}

export interface SignInStateRecord extends TypedRecord<SignInStateRecord>, SignInState {}

const initialSignInState: SignInState = {
  isLoading: false,
  isFailed: false,
  hasError: false,
  email: "",
  password: "",
  onFocus: null,
  isNotUnsignedUpWithSocial: false,
};

export const SignInStateFactory = makeTypedFactory<SignInState, SignInStateRecord>(initialSignInState);

export const SIGN_IN_INITIAL_STATE = SignInStateFactory();
