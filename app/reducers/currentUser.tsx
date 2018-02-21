import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { CURRENT_USER_INITIAL_STATE, CurrentUserRecord, currentUserFactory } from "../model/currentUser";

export function reducer(state = CURRENT_USER_INITIAL_STATE, action: IReduxAction<any>): CurrentUserRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return currentUserFactory(action.payload.user).withMutations(currentUser => {
        currentUser.set("isLoggedIn", action.payload.loggedIn).set("oauthLoggedIn", action.payload.oauthLoggedIn);
      });
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return CURRENT_USER_INITIAL_STATE;
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      if (action.payload.loggedIn) {
        return currentUserFactory(action.payload.user).withMutations(currentUser => {
          currentUser.set("isLoggedIn", action.payload.loggedIn).set("oauthLoggedIn", action.payload.oauthLoggedIn);
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN: {
      return state.set("emailVerified", true);
    }

    default:
      return state;
  }
}
