import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ISignUpState {
  isLoading: boolean;
  hasError: boolean;
  email: string;
  password: string;
  fullName: string;
  repeatPassword: string;
  errorType: string;
  errorContent: string;
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
  errorType: "",
  errorContent: ""
};

export const SignUpStateFactory = makeTypedFactory<
  ISignUpState,
  ISignUpStateRecord
>(initialSignInState);

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
