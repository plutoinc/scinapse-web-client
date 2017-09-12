import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT,
    payload: {
      email,
    },
  };
}

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export interface ISignInParams {
  email: string;
  password: string;
}

export function signIn(params: ISignInParams) {
  return async (dispatch: Dispatch<Function>) => {
    const { email, password } = params;
    let hasError = false;
    let errorContent = "";

    // e-mail empty check
    errorContent = "";
    if (email === "" || email.length <= 0) {
      hasError = true;
      errorContent = "e-mail input is empty";
    } else {
      // e-mail validation by regular expression
      const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!reg.test(email)) {
        hasError = true;
        errorContent = "Please input valid e-mail";
      }
    }
    dispatch({
      type: ACTION_TYPES.SIGN_IN_HAS_ERROR,
      payload: {
        type: "email",
        content: errorContent,
      },
    });

    // Password empty check
    errorContent = "";
    if (password === "" || password.length <= 0) {
      hasError = true;
      errorContent = "password input is empty";
    }
    dispatch({
      type: ACTION_TYPES.SIGN_IN_HAS_ERROR,
      payload: {
        type: "password",
        content: errorContent,
      },
    });

    if (hasError) return;

    dispatch({
      type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN,
    });

    try {
      await AuthAPI.signIn({
        email: params.email,
        password: params.password,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
      });
      alert("Succeeded to Sign in! Move to Home");
      dispatch(push("/"));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
      });
    }
  };
}
