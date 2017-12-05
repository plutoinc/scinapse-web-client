import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";

export enum SIGN_UP_STEP {
  FIRST,
  SECOND,
  FINAL,
}

export interface ISignUpState {
  isLoading: boolean;
  hasError: boolean;
  email: string;
  password: string;
  name: string;
  affiliation: string;
  affiliationEmail: string;
  onFocus: SIGN_UP_ON_FOCUS_TYPE | null;
  hasErrorCheck: ISignUpHasErrorCheckRecord;
  step: SIGN_UP_STEP;
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
  name: IFormErrorRecord;
  affiliation: IFormErrorRecord;
}

export const initialErrorCheck: ISignUpHasErrorCheckRecord = recordify({
  email: initialFormError,
  password: initialFormError,
  name: initialFormError,
  affiliation: initialFormError,
});

export interface ISignUpStateRecord extends TypedRecord<ISignUpStateRecord>, ISignUpState {}

export enum SIGN_UP_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
  AFFILIATION,
  AFFILIATION_EMAIL,
  NAME,
}

const initialSignUpState: ISignUpState = {
  isLoading: false,
  hasError: false,
  email: "",
  password: "",
  name: "",
  affiliation: "",
  affiliationEmail: "",
  onFocus: null,
  hasErrorCheck: initialErrorCheck,
  step: SIGN_UP_STEP.FIRST,
};

export const SignUpStateFactory = makeTypedFactory<ISignUpState, ISignUpStateRecord>(initialSignUpState);

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
