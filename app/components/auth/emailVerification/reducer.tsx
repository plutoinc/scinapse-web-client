import { EmailVerificationStateRecord, EMAIL_VERIFICATION_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(
  state = EMAIL_VERIFICATION_INITIAL_STATE,
  action: ReduxAction<any>,
): EmailVerificationStateRecord {
  switch (action.type) {
    case ACTION_TYPES.EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", false);
      });
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", false);
      });
    }

    default:
      return state;
  }
}
