import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { validateEmail } from "../../../helpers/validateEmail";

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
        dispatch({
          type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
          payload: {
            user: signInResult.member,
          },
        });
        alert("Succeeded to Sign in! Move to Home");
        dispatch(push("/"));
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
      });
    }
  };
}
