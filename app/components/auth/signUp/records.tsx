import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";
import { OAUTH_VENDOR } from "../../../api/auth";

export enum SIGN_UP_STEP {
  FIRST,
  WITH_EMAIL,
  WITH_SOCIAL,
  FINAL,
}

export interface ISignUpState {
  isLoading: boolean;
  hasError: boolean;
  email: string;
  password: string;
  name: string;
  affiliation: string;
  onFocus: SIGN_UP_ON_FOCUS_TYPE | null;
  hasErrorCheck: ISignUpHasErrorCheckRecord;
  step: SIGN_UP_STEP;
  isFixed: ISignUpIsFixed;
  oauth: ISignUpOauthInfo;
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

export interface ISignUpIsFixed {
  email: Boolean;
  name: Boolean;
}

export const initialIsFixed: ISignUpIsFixed = recordify({
  email: false,
  name: false,
});

export interface ISignUpOauthInfo {
  code: string;
  oauthId: string;
  uuid: string;
  vendor: OAUTH_VENDOR | null;
}

export const initialOauthInfo: ISignUpOauthInfo = recordify({
  code: null,
  oauthId: null,
  uuid: null,
  vendor: null,
});

export interface ISignUpStateRecord extends TypedRecord<ISignUpStateRecord>, ISignUpState {}

export enum SIGN_UP_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
  AFFILIATION,
  NAME,
}

const initialSignUpState: ISignUpState = {
  isLoading: false,
  hasError: false,
  email: "",
  password: "",
  name: "",
  affiliation: "",
  onFocus: null,
  hasErrorCheck: initialErrorCheck,
  step: SIGN_UP_STEP.FIRST,
  oauth: initialOauthInfo,
  isFixed: initialIsFixed,
};

export const SignUpStateFactory = makeTypedFactory<ISignUpState, ISignUpStateRecord>(initialSignUpState);

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
