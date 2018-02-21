import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface EmailVerificationState {
  isLoading: boolean;
  hasError: boolean;
}

export interface EmailVerificationStateRecord
  extends TypedRecord<EmailVerificationStateRecord>,
    EmailVerificationState {}

export const initialEmailVerificationState: EmailVerificationState = {
  isLoading: false,
  hasError: false,
};

export const EmailVerificationStateFactory = makeTypedFactory<EmailVerificationState, EmailVerificationStateRecord>(
  initialEmailVerificationState,
);

export const EMAIL_VERIFICATION_INITIAL_STATE = EmailVerificationStateFactory();
