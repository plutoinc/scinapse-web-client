import { ACTION_TYPES } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "./records";

export function openSignIn() {
  return {
    type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
    payload: {
      type: GLOBAL_DIALOG_TYPE.SIGN_IN,
    },
  };
}

export function openSignUp() {
  return {
    type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
    payload: {
      type: GLOBAL_DIALOG_TYPE.SIGN_UP,
    },
  };
}

export function openVerificationNeeded() {
  return {
    type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
    payload: {
      type: GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED,
    },
  };
}

export function closeDialog() {
  return {
    type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE,
  };
}

export function changeDialogType(type: GLOBAL_DIALOG_TYPE) {
  return {
    type: ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE,
    payload: {
      type,
    },
  };
}
