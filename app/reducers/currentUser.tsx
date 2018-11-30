import { ACTION_TYPES } from "../actions/actionTypes";
import { CURRENT_USER_INITIAL_STATE, CurrentUser } from "../model/currentUser";

export function reducer(state: CurrentUser = CURRENT_USER_INITIAL_STATE, action: ReduxAction<any>): CurrentUser {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return {
        ...action.payload.user,
        isLoggedIn: action.payload.user,
        oauthLoggedIn: action.payload.oauthLoggedIn,
      };
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return CURRENT_USER_INITIAL_STATE;
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEED_TO_CONNECT_AUTHOR: {
      return {
        ...state,
        is_author_connected: true,
        author_id: action.payload.authorId,
      };
    }

    case ACTION_TYPES.AUTH_START_TO_CHECK_LOGGED_IN: {
      return { ...state, isLoggingIn: true };
    }

    case ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN: {
      return { ...state, isLoggingIn: false };
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      if (action.payload.loggedIn) {
        return {
          ...action.payload.user,
          isLoggedIn: action.payload.loggedIn,
          oauthLoggedIn: action.payload.oauthLoggedIn,
          isLoggingIn: false,
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN: {
      return { ...state, emailVerified: true };
    }

    default:
      return state;
  }
}
