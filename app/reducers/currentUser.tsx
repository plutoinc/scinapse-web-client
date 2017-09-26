import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { CURRENT_USER_INITIAL_STATE, ICurrentUserRecord, CurrentUserFactory } from "../model/currentUser";

export function reducer(state = CURRENT_USER_INITIAL_STATE, action: IReduxAction<any>): ICurrentUserRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return CurrentUserFactory(action.payload.user).set("isLoggedIn", true);
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return CURRENT_USER_INITIAL_STATE;
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      return CurrentUserFactory(action.payload.user).set("isLoggedIn", true);
    }

    default:
      return state;
  }
}
