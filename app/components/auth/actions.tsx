import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../api/auth";
import { ACTION_TYPES } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";

export function signOut() {
  return async (dispatch: Dispatch<any>) => {
    try {
      await AuthAPI.signOut();
      dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
      });

      alertToast({
        type: "success",
        message: "Succeeded to Sign Out! Move to Home",
      });
      dispatch(push("/"));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_SIGN_OUT,
      });

      alertToast({
        type: "error",
        message: "Failed to Sign Out! go back",
      });
    }
  };
}

export function checkLoggedIn() {
  return async (dispatch: Dispatch<any>) => {
    try {
      const checkLoggedInResult = await AuthAPI.checkLoggedIn();

      if (checkLoggedInResult.loggedIn) {
        dispatch({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
          payload: {
            user: checkLoggedInResult.member,
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
