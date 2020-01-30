import { ACTION_TYPES } from '../actions/actionTypes';
import { CURRENT_USER_INITIAL_STATE, CurrentUser } from '../model/currentUser';

export function reducer(state: CurrentUser = CURRENT_USER_INITIAL_STATE, action: ReduxAction<any>): CurrentUser {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return {
        ...action.payload.user,
        isLoggedIn: action.payload.loggedIn,
        oauthLoggedIn: action.payload.oauthLoggedIn,
        ipInstitute: action.payload.ipInstitute,
        isLoggingIn: false,
      };
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return { ...CURRENT_USER_INITIAL_STATE, isLoggingIn: false, ipInstitute: state.ipInstitute };
    }

    case ACTION_TYPES.AUTH_START_TO_CHECK_LOGGED_IN: {
      return { ...state, isLoggingIn: true };
    }

    case ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN: {
      return { ...CURRENT_USER_INITIAL_STATE, isLoggingIn: false };
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN: {
      return { ...state, emailVerified: true };
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      if (action.payload.loggedIn) {
        return {
          ...action.payload.user,
          isLoggedIn: action.payload.loggedIn,
          oauthLoggedIn: action.payload.oauthLoggedIn,
          ipInstitute: action.payload.ipInstitute,
          isLoggingIn: false,
        };
      }

      return {
        ...state,
        ipInstitute: action.payload.ipInstitute,
        isLoggingIn: false,
      };
    }

    default:
      return state;
  }
}
