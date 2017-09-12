import { Dispatch } from "redux";
import { push } from "react-router-redux";
import apiHelper from "../../../helpers/apiHelper";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
    payload: {
      email
    }
  };
}

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
    payload: {
      password
    }
  };
}

export function changeRepeatPasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT,
    payload: {
      password
    }
  };
}

export function changeFullNameInput(fullName: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_FULL_NAME_INPUT,
    payload: {
      fullName
    }
  };
}

export interface ICreateNewAccountParams {
  email: string;
  password: string;
  repeatPassword: string;
  fullName: string;
}

export function createNewAccount(params: ICreateNewAccountParams) {
  return async (dispatch: Dispatch<any>) => {
    // e-mail empty check
    const { email, password, repeatPassword, fullName } = params;
    let hasError = false;
    let errorContent = "";
    // e-mail empty check
    errorContent = "";
    if (email === "" || email.length <= 0) {
      hasError = true;
      errorContent = "e-mail input is empty";
    }
    dispatch({
      type: ACTION_TYPES.SIGN_UP_HAS_ERROR,
      payload: {
        type: "email",
        content: errorContent
      }
    });

    // e-mail validation by regular expression
    errorContent = "";
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(email)) {
      hasError = true;
      errorContent = "Please input valid e-mail";
    }
    dispatch({
      type: ACTION_TYPES.SIGN_UP_HAS_ERROR,
      payload: {
        type: "email",
        content: errorContent
      }
    });

    // Password empty check
    errorContent = "";
    if (password === "" || password.length <= 0) {
      hasError = true;
      errorContent = "password input is empty";
    }
    dispatch({
      type: ACTION_TYPES.SIGN_UP_HAS_ERROR,
      payload: {
        type: "password",
        content: errorContent
      }
    });

    // repeat password Validation
    errorContent = "";
    if (password !== repeatPassword) {
      hasError = true;
      errorContent = "same password please";
    }
    dispatch({
      type: ACTION_TYPES.SIGN_UP_HAS_ERROR,
      payload: {
        type: "repeatPassword",
        content: errorContent
      }
    });

    // fullName empty check
    errorContent = "";
    if (fullName === "" || fullName.length < 2) {
      hasError = true;
      errorContent = "fullName input is under 2 character";
    }
    dispatch({
      type: ACTION_TYPES.SIGN_UP_HAS_ERROR,
      payload: {
        type: "fullName",
        content: errorContent
      }
    });

    if (hasError) return;

    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT
    });
    try {
      await apiHelper.signUp({
        email: params.email,
        password: params.password,
        repeatPassword: params.repeatPassword,
        fullName: params.fullName
      });

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT
      });
      alert("Succeeded to Sign up! Move to Sign in");
      dispatch(push("sign_in"));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT
      });
    }
  };
}
