import { Dispatch } from "redux";
import { push } from "react-router-redux";
import apiHelper from "../../../helpers/apiHelper";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT,
    payload: {
      email
    }
  };
}

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT,
    payload: {
      password
    }
  };
}

export interface ISignInParams {
  email: string;
  password: string;
}

export function signIn(params: ISignInParams) {
  return async (dispatch: Dispatch<Function>) => {
    dispatch({
      type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN
    });

    try {
      await apiHelper.signIn({
        email: params.email,
        password: params.password
      });

      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN
      });
      alert("Succeeded to Sign in! Move to Home");
      dispatch(push("/"));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN
      });
    }
  };
}
