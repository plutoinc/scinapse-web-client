import { Dispatch } from "redux";
import { CancelToken } from "axios";
import AuthAPI from "../../api/auth";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { SignInResult } from "../../api/types/auth";
import { getCollections } from "../collections/actions";

export function signOut() {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (confirm("Do you really want to sign out?")) {
        await AuthAPI.signOut();
        dispatch({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_SIGN_OUT,
      });
      throw err;
    }
  };
}

export function checkAuthStatus(cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const checkLoggedInResult: SignInResult = await AuthAPI.checkLoggedIn();

      dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
        payload: {
          user: checkLoggedInResult.member,
          loggedIn: checkLoggedInResult.loggedIn,
          oauthLoggedIn: checkLoggedInResult.oauthLoggedIn,
        },
      });
      if (checkLoggedInResult.member) {
        dispatch(getCollections(checkLoggedInResult.member.id, cancelToken));
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN,
      });
    }
  };
}
