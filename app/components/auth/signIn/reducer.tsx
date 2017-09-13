import { IReduxAction } from "../../../typings/actionType";
import { ISignInStateRecord, SIGN_IN_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(
  state = SIGN_IN_INITIAL_STATE,
  action: IReduxAction<any>
): ISignInStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT: {
      return state.set("email", action.payload.email);
    }

    case ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT: {
      return state.set("password", action.payload.password);
    }

    case ACTION_TYPES.SIGN_IN_FORM_ERROR: {
      return state.set("formError", true);
    }

    case ACTION_TYPES.SIGN_IN_VALID_FORM: {
      return state.set("formError", false);
    }

    case ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN: {
      return state.set("isLoading", true);
    }

    case ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN: {
      return state.set("isLoading", false);
    }

    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return state.set("isLoading", false);
    }

    default:
      return state;
  }
}
