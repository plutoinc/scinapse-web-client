import { AUTH_CHECKER_INITIAL_STATE, AuthCheckerStateRecord } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = AUTH_CHECKER_INITIAL_STATE, action: ReduxAction<any>): AuthCheckerStateRecord {
  switch (action.type) {
    case ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN:
    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      return state.set("isLoading", false);
    }

    default: {
      return state;
    }
  }
}
