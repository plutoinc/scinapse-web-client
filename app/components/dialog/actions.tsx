import { ACTION_TYPES } from "../../actions/actionTypes";

export function openSignIn() {
  return {
    type: ACTION_TYPES.DIALOG_OPEN,
    payload: {
      type: "sign_in",
    },
  };
}

export function openSignUp() {
  return {
    type: ACTION_TYPES.DIALOG_OPEN,
    payload: {
      type: "sign_up",
    },
  };
}

export function closeDialog() {
  return {
    type: ACTION_TYPES.DIALOG_CLOSE,
  };
}
