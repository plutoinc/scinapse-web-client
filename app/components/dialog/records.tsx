import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export enum GLOBAL_DIALOG_TYPE {
  SIGN_IN,
  SIGN_UP,
  WALLET,
  VERIFICATION_NEEDED,
  EXTRA,
}

export interface DialogState {
  isLoading: boolean;
  hasError: boolean;
  isOpen: boolean;
  type: GLOBAL_DIALOG_TYPE;
}

export interface DialogStateRecord extends TypedRecord<DialogStateRecord>, DialogState {}

export const initialDialogState = {
  isLoading: false,
  hasError: false,
  isOpen: false,
  type: GLOBAL_DIALOG_TYPE.EXTRA,
};

export const DialogStateFactory = makeTypedFactory<DialogState, DialogStateRecord>(initialDialogState);

export const DIALOG_INITIAL_STATE = DialogStateFactory();
