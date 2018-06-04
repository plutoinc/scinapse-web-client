import { Dispatch } from "redux";
import AuthAPI from "../../api/auth";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ISignInResult } from "../../api/types/auth";
import alertToast from "../../helpers/makePlutoToastAction";

export function signOut() {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (confirm("Do you really want to sign Out?")) {
        await AuthAPI.signOut();
        dispatch({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
        });
      }
    } catch (_err) {
      alertToast({
        type: "error",
        message: `Failed to sign out.`,
      });
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_SIGN_OUT,
      });
    }
  };
}

export function checkLoggedIn() {
  return async (dispatch: Dispatch<any>) => {
    try {
      const checkLoggedInResult: ISignInResult = await AuthAPI.checkLoggedIn();
      dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
        payload: {
          user: checkLoggedInResult.member,
          loggedIn: checkLoggedInResult.loggedIn,
          oauthLoggedIn: checkLoggedInResult.oauthLoggedIn,
        },
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to check logged in state. ${err}`,
      });
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN,
      });
    }
  };
}
