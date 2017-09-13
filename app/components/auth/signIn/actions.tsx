import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
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
    const { email, password } = params;

    // e-mail empty check && e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(email) || email === "" || email.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR
      });
      return;
    }

    // Password empty check
    if (password === "" || password.length < 6) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR
      });
      return;
    }

    dispatch({
      type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN
    });

    try {
      const recordedCurrentUser = await AuthAPI.signIn({
        email: params.email,
        password: params.password
      });

      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: {
            email: recordedCurrentUser.email,
            memberId: 3223,
            nickName: "23",
            password: "3232"
          }
        }
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
