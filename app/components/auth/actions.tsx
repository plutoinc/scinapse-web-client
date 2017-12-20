import { Dispatch } from "redux";
import AuthAPI from "../../api/auth";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ISignInResult } from "../../api/auth";

export function signOut() {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (confirm("Do you really want to sign Out?")) {
        await AuthAPI.signOut();
        dispatch({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_SIGN_OUT,
      });

      alert(`Failed to Sign Out! ${err}`);
    }
  };
}

export function checkLoggedIn() {
  return async (dispatch: Dispatch<any>) => {
    try {
      const checkLoggedInResult: ISignInResult = await AuthAPI.checkLoggedIn();

      if (checkLoggedInResult.loggedIn) {
        dispatch({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
          payload: {
            user: checkLoggedInResult.member,
            loggedIn: checkLoggedInResult.loggedIn,
            oauthLoggedIn: checkLoggedInResult.oauthLoggedIn,
          },
        });
      } else {
        dispatch({
          type: ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN,
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN,
      });
    }
  };
}
