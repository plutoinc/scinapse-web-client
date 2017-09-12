import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ISignUpState {
  isLoading: boolean;
  hasError: boolean;
  email: string;
  password: string;
  fullName: string;
  repeatPassword: string;
  emailErrorContent: string;
  passwordErrorContent: string;
  repeatPasswordErrorContent: string;
  fullNameErrorContent: string;
}

export interface ISignUpStateRecord
  extends TypedRecord<ISignUpStateRecord>,
    ISignUpState {}

const initialSignInState = {
  isLoading: false,
  hasError: false,
  email: "",
  password: "",
  fullName: "",
  repeatPassword: "",
  emailErrorContent: "",
  passwordErrorContent: "",
  repeatPasswordErrorContent: "",
  fullNameErrorContent: ""
};

export const SignUpStateFactory = makeTypedFactory<
  ISignUpState,
  ISignUpStateRecord
>(initialSignInState);

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
