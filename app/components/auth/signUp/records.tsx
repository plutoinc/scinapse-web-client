import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ISignUpState {
  isLoading: boolean;
  isFailed: boolean;
  hasError: boolean;
  email: string;
  password: string;
  fullName: string;
  repeatPassword: string;
}

export interface ISignUpStateRecord extends TypedRecord<ISignUpStateRecord>, ISignUpState {}

const initialSignInState = {
  isLoading: false,
  isFailed: false,
  hasError: false,
  email: "",
  password: "",
  fullName: "",
  repeatPassword: "",
};

export const SignUpStateFactory = makeTypedFactory<ISignUpState, ISignUpStateRecord>(initialSignInState);

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
