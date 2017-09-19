import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../api/auth";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function signOut() {
  return async (dispatch: Dispatch<any>) => {
    try {
      await AuthAPI.signOut();
      dispatch({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
      });
      alert("Succeeded to Sign Out! Move to Home");
      dispatch(push("/"));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.AUTH_FAILED_TO_SIGN_OUT,
      });
      alert("Failed to Sign Out! goBack");
    }
  };
}

export function checkLoggedIn() {
  return async (dispatch: Dispatch<any>) => {
    try {
      const result = await AuthAPI.checkLoggedIn();
      if (result.loggedIn) {
        dispatch({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
          payload: {
            user: {
              email: result.email,
              memberId: 123,
              nickName: "mockNickName",
              password: "mockPassword",
            },
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
