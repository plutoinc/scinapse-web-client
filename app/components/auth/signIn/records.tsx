import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export enum SIGN_IN_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
}

export interface ISignInState {
  isLoading: boolean;
  isFailed: boolean;
  hasError: boolean;
  email: string;
  password: string;
  onFocus: SIGN_IN_ON_FOCUS_TYPE | null;
}

export interface ISignInStateRecord extends TypedRecord<ISignInStateRecord>, ISignInState {}

const initialSignInState: ISignInState = {
  isLoading: false,
  isFailed: false,
  hasError: false,
  email: "",
  password: "",
  onFocus: null,
};

export const SignInStateFactory = makeTypedFactory<ISignInState, ISignInStateRecord>(initialSignInState);

export const SIGN_IN_INITIAL_STATE = SignInStateFactory();
