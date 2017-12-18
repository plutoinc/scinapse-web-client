import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IEmailConfirmState {
  isLoading: boolean;
  hasError: boolean;
}

export interface IEmailConfirmStateRecord extends TypedRecord<IEmailConfirmStateRecord>, IEmailConfirmState {}

const initialEmailConfirmState: IEmailConfirmState = {
  isLoading: false,
  hasError: false,
};

export const EmailConfirmFactory = makeTypedFactory<IEmailConfirmState, IEmailConfirmStateRecord>(
  initialEmailConfirmState,
);

export const EMAIL_CONFIRM_INITIAL_STATE = EmailConfirmFactory();
