import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../api/auth";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function signOut() {
  return async (dispatch: Dispatch<any>) => {
    try {
      await AuthAPI.signOut();
      dispatch({
        type: ACTION_TYPES.SIGN_OUT_SUCCEEDED_TO_SIGN_OUT
      });
      alert("Succeeded to Sign Out! Move to Home");
      dispatch(push("/"));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_OUT_FAILED_TO_SIGN_OUT
      });
      alert("Failed to Sign Out! goBack");
    }
  };
}
