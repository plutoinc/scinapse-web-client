import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "./reducer";

export function openSignIn() {
  return ActionCreators.openGlobalModal({
    type: GLOBAL_DIALOG_TYPE.SIGN_IN
  });
}

export function openSignUp() {
  return ActionCreators.openGlobalModal({
    type: GLOBAL_DIALOG_TYPE.SIGN_UP
  });
}

export function openVerificationNeeded() {
  return ActionCreators.openGlobalModal({
    type: GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED
  });
}

export function closeDialog() {
  return ActionCreators.closeGlobalModal();
}

export function changeModalType(type: GLOBAL_DIALOG_TYPE) {
  return ActionCreators.changeGlobalModal({ type });
}
