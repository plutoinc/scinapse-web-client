import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";
import { OAUTH_VENDOR } from "../../../api/types/auth";

export enum SIGN_UP_STEP {
  FIRST,
  WITH_EMAIL,
  WITH_SOCIAL,
  FINAL_WITH_EMAIL,
}

export enum SIGN_UP_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
  AFFILIATION,
  NAME,
}

export interface SignUpState {
  isLoading: boolean;
  hasError: boolean;
  email: string;
  password: string;
  name: string;
  affiliation: string;
  onFocus: SIGN_UP_ON_FOCUS_TYPE | null;
  hasErrorCheck: SignUpErrorCheck;
  step: SIGN_UP_STEP;
  oauth: SignUpOauthInfo;
}

export interface SignUpOauthInfo {
  code: string;
  oauthId: string;
  uuid: string;
  vendor: OAUTH_VENDOR | null;
}

export interface FormError {
  hasError: boolean;
  errorMessage: string | null;
}

export interface SignUpErrorCheck {
  email: FormError;
  password: FormError;
  name: FormError;
  affiliation: FormError;
}

export interface InnerRecordifiedSignUpErrorCheck {
  email: FormErrorRecord;
  password: FormErrorRecord;
  name: FormErrorRecord;
  affiliation: FormErrorRecord;
}

export interface InnerRecordifiedSignUpState extends SignUpState {
  hasErrorCheck: SignUpErrorCheckRecord;
  oauth: SignUpOauthInfoRecord;
}

export interface FormErrorRecord extends TypedRecord<FormErrorRecord>, FormError {}
export interface SignUpErrorCheckRecord extends TypedRecord<SignUpErrorCheckRecord>, InnerRecordifiedSignUpErrorCheck {}
export interface SignUpOauthInfoRecord extends TypedRecord<SignUpOauthInfoRecord>, SignUpOauthInfo {}
export interface SignUpStateRecord extends TypedRecord<SignUpStateRecord>, InnerRecordifiedSignUpState {}

export const initialFormError: FormError = {
  hasError: false,
  errorMessage: null,
};

export const initialErrorCheck: SignUpErrorCheck = {
  email: initialFormError,
  password: initialFormError,
  name: initialFormError,
  affiliation: initialFormError,
};

export const initialOauthInfo: SignUpOauthInfo = {
  code: null,
  oauthId: null,
  uuid: null,
  vendor: null,
};

export const signUpInitialState: SignUpState = {
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
};

export const FormErrorFactory = makeTypedFactory<FormError, FormErrorRecord>(initialFormError);
export const SignUpOauthInfoFactory = makeTypedFactory<SignUpOauthInfo, SignUpOauthInfoRecord>(initialOauthInfo);
export const SignUpErrorCheckFactory = (params = initialErrorCheck): SignUpErrorCheckRecord => {
  const innerRecordifiedSignUpErrorCheck = {
    email: FormErrorFactory(params.email),
    name: FormErrorFactory(params.name),
    password: FormErrorFactory(params.password),
    affiliation: FormErrorFactory(params.affiliation),
  };

  return recordify(innerRecordifiedSignUpErrorCheck);
};

export const SignUpStateFactory = (params = signUpInitialState): SignUpStateRecord => {
  const innerRecordifiedSignUpState = {
    isLoading: params.isLoading,
    hasError: params.hasError,
    email: params.email,
    password: params.password,
    name: params.name,
    affiliation: params.affiliation,
    onFocus: params.onFocus,
    hasErrorCheck: SignUpErrorCheckFactory(params.hasErrorCheck),
    step: params.step,
    oauth: SignUpOauthInfoFactory(params.oauth),
  };

  return recordify(innerRecordifiedSignUpState);
};

export const SIGN_UP_INITIAL_STATE = SignUpStateFactory();
