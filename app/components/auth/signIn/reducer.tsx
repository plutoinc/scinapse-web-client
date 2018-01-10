import { IReduxAction } from "../../../typings/actionType";
import { ISignInStateRecord, SIGN_IN_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(state = SIGN_IN_INITIAL_STATE, action: IReduxAction<any>): ISignInStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT: {
      return state.set("email", action.payload.email);
    }

    case ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT: {
      return state.set("password", action.payload.password);
    }

    case ACTION_TYPES.SIGN_IN_ON_FOCUS_INPUT: {
      return state.set("onFocus", action.payload.type);
    }

    case ACTION_TYPES.SIGN_IN_ON_BLUR_INPUT: {
      return state.set("onFocus", null);
    }

    case ACTION_TYPES.SIGN_IN_FORM_ERROR: {
      return state.set("hasError", true);
    }

    case ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", false);
      });
    }

    case ACTION_TYPES.SIGN_IN_FAILED_UNSIGNED_UP_WITH_SOCIAL: {
      return state.set("isUnsignedUpWithSocial", true);
    }

    case ACTION_TYPES.SIGN_IN_GO_BACK: {
      return SIGN_IN_INITIAL_STATE;
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return SIGN_IN_INITIAL_STATE;
    }

    default:
      return state;
  }
}
