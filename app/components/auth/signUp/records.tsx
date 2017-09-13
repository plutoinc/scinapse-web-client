import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ISignUpState {
  isLoading: boolean;
  email: string;
  password: string;
  fullName: string;
  repeatPassword: string;
  formError: boolean;
  errorType: string;
  errorContent: string;
}

export interface ISignUpStateRecord
  extends TypedRecord<ISignUpStateRecord>,
    ISignUpState {}

const initialSignInState = {
  isLoading: false,
  email: "",
  password: "",
  fullName: "",
  repeatPassword: "",
  formError: false,
  errorType: "",
  errorContent: ""
};

export const SignUpStateFactory = makeTypedFactory<
  ISignUpState,
  ISignUpStateRecord
>(initialSignInState);

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
