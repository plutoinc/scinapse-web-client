import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { validateEmail } from "../../../helpers/validateEmail";
import { SIGN_IN_ON_FOCUS_TYPE } from "./records";

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

export function onFocusInput(type: SIGN_IN_ON_FOCUS_TYPE) {
  return {
    type: ACTION_TYPES.SIGN_IN_ON_FOCUS_INPUT,
    payload: {
      type,
    },
  };
}

export function onBlurInput() {
  return {
    type: ACTION_TYPES.SIGN_IN_ON_BLUR_INPUT,
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
    if (!validateEmail(email)) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR,
      });
      return;
    }

    // Password empty check
    if (password === "" || password.length < 6) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR,
      });
      return;
    }

    dispatch({
      type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN,
    });

    try {
      const signInResult = await AuthAPI.signIn({
        email: params.email,
        password: params.password,
      });

      if (signInResult.loggedIn) {
        dispatch(push("/"));
        dispatch({
          type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
          payload: {
            user: signInResult.member,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
      });
    }
  };
}
