import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IDialogState {
  isLoading: boolean;
  hasError: boolean;
  isOpen: boolean;
  type: string;
}

export interface IDialogStateRecord extends TypedRecord<IDialogStateRecord>, IDialogState {}

const initialDialogState = {
  isLoading: false,
  hasError: false,
  isOpen: false,
  type: "",
};

export const DialogStateFactory = makeTypedFactory<IDialogState, IDialogStateRecord>(initialDialogState);

export const DIALOG_INITIAL_STATE = DialogStateFactory();
