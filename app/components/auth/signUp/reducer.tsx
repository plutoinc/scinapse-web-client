import { IReduxAction } from "../../../typings/actionType";
import { SIGN_UP_INITIAL_STATE, ISignUpStateRecord, SIGN_UP_STEP } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(state = SIGN_UP_INITIAL_STATE, action: IReduxAction<any>): ISignUpStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT: {
      return state.set("email", action.payload.email);
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT: {
      return state.set("password", action.payload.password);
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_NAME_INPUT: {
      return state.set("name", action.payload.name);
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT: {
      return state.set("affiliation", action.payload.affiliation);
    }

    case ACTION_TYPES.SIGN_UP_FORM_ERROR: {
      return state.withMutations(currentState => {
        return currentState
          .setIn(["hasErrorCheck", action.payload.type, "hasError"], true)
          .setIn(["hasErrorCheck", action.payload.type, "errorMessage"], action.payload.errorMessage);
      });
    }

    case ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR: {
      return state.withMutations(currentState => {
        return currentState
          .setIn(["hasErrorCheck", action.payload.type, "hasError"], false)
          .setIn(["hasErrorCheck", action.payload.type, "errorMessage"], null);
      });
    }

    case ACTION_TYPES.SIGN_UP_ON_FOCUS_INPUT: {
      return state.set("onFocus", action.payload.type);
    }

    case ACTION_TYPES.SIGN_UP_ON_BLUR_INPUT: {
      return state.set("onFocus", null);
    }

    case ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", false);
      });
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_SIGN_UP_STEP: {
      return state.set("step", action.payload.step);
    }

    case ACTION_TYPES.SIGN_UP_GET_AUTHORIZE_CODE: {
      return state.withMutations(currentState => {
        return currentState.set("step", SIGN_UP_STEP.WITH_SOCIAL);
      });
    }

    case ACTION_TYPES.SIGN_UP_START_TO_EXCHANGE: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoading", false)
          .set("hasError", false)
          .set("email", action.payload.email)
          .set("name", action.payload.name)
          .set("oauth", action.payload.oauth);
      });
    }

    case ACTION_TYPES.SIGN_UP_FIX_INPUT: {
      return state.setIn(["isFixed", action.payload.inputField], true);
    }

    case ACTION_TYPES.SIGN_UP_GO_BACK: {
      return SIGN_UP_INITIAL_STATE;
    }

    case ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE: {
      return SIGN_UP_INITIAL_STATE;
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return SIGN_UP_INITIAL_STATE;
    }

    default:
      return state;
  }
}
