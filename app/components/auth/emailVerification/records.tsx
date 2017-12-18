import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IEmailVerificationState {
  isLoading: boolean;
  hasError: boolean;
}

export interface IEmailVerificationStateRecord
  extends TypedRecord<IEmailVerificationStateRecord>,
    IEmailVerificationState {}

const initialEmailVerificationState: IEmailVerificationState = {
  isLoading: false,
  hasError: false,
};

export const EmailVerificationFactory = makeTypedFactory<IEmailVerificationState, IEmailVerificationStateRecord>(
  initialEmailVerificationState,
);

export const EMAIL_VERIFICATION_INITIAL_STATE = EmailVerificationFactory();
