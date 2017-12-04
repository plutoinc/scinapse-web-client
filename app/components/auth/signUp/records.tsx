import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";

export interface ISignUpState {
  isLoading: boolean;
  hasError: boolean;
  email: string;
  password: string;
  affiliation: string;
  affiliationEmail: string;
  onFocus: SIGN_UP_ON_FOCUS_TYPE | null;
  hasErrorCheck: ISignUpHasErrorCheckRecord;
}

export interface IFormError {
  hasError: boolean;
  errorMessage: string | null;
}

export interface IFormErrorRecord extends TypedRecord<IFormErrorRecord>, IFormError {}

export const initialFormError: IFormErrorRecord = recordify({
  hasError: false,
  errorMessage: null,
});

export interface ISignUpHasErrorCheckRecord {
  email: IFormErrorRecord;
  password: IFormErrorRecord;
  affiliation: IFormErrorRecord;
}

export const initialErrorCheck: ISignUpHasErrorCheckRecord = recordify({
  email: initialFormError,
  password: initialFormError,
  affiliation: initialFormError,
});

export interface ISignUpStateRecord extends TypedRecord<ISignUpStateRecord>, ISignUpState {}

export enum SIGN_UP_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
  AFFILIATION,
  AFFILIATION_EMAIL,
}

const initialSignUpState: ISignUpState = {
  isLoading: false,
  hasError: false,
  email: "",
  password: "",
  affiliation: "",
  affiliationEmail: "",
  onFocus: null,
  hasErrorCheck: initialErrorCheck,
};

export const SignUpStateFactory = makeTypedFactory<ISignUpState, ISignUpStateRecord>(initialSignUpState);

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
