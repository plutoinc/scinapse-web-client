import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
    payload: {
      email
    }
  };
}

export function checkValidEmailInput(email: string) {
  // e-mail empty check && e-mail validation by regular expression
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reg.test(email) || email === "" || email.length <= 0) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "email",
        content: "Please enter a valid email address"
      }
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "",
        content: ""
      }
    };
  }
}

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
    payload: {
      password
    }
  };
}

export function checkValidPasswordInput(password: string) {
  // Password empty check
  if (password === "" || password.length <= 0) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "password",
        content: "Please enter password"
      }
    };
  } else if (password.length < 6) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "password",
        content: "Must have at least 6 characters!"
      }
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "",
        content: ""
      }
    };
  }
}

export function changeRepeatPasswordInput(repeatPassword: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT,
    payload: {
      repeatPassword
    }
  };
}

export function checkValidRepeatPasswordInput(
  password: string,
  repeatPassword: string
) {
  // repeat password Validation
  if (repeatPassword === "" || repeatPassword.length <= 0) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "repeatPassword",
        content: "Please re-enter your password"
      }
    };
  } else if (password !== repeatPassword) {
    console.log(password);
    console.log(repeatPassword);
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "repeatPassword",
        content: "It is not the same as the password you entered previously."
      }
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "",
        content: ""
      }
    };
  }
}

export function changeFullNameInput(fullName: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_FULL_NAME_INPUT,
    payload: {
      fullName
    }
  };
}

export function checkValidFullNameInput(fullName: string) {
  // fullName empty check
  if (fullName === "" || fullName.length < 2) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "fullName",
        content: "Please enter your name."
      }
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "",
        content: ""
      }
    };
  }
}

export function removeFormErrorMessage() {
  return {
    type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR
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
    const { email, password, repeatPassword, fullName } = params;
    // e-mail empty check && e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(email) || email === "" || email.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "email",
          content: "Please enter a valid email address"
        }
      });
      return;
    }
    // Password empty check
    if (password === "" || password.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "password",
          content: "Please enter password"
        }
      });
      return;
    } else if (password.length < 6) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "password",
          content: "Must have at least 6 characters!"
        }
      });
      return;
    }

    // repeat password Validation
    if (repeatPassword === "" || repeatPassword.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "repeatPassword",
          content: "Please re-enter your password"
        }
      });
      return;
    } else if (password !== repeatPassword) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "repeatPassword",
          content: "It is not the same as the password you entered previously."
        }
      });
      return;
    }

    // fullName empty check
    if (fullName === "" || fullName.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "fullName",
          content: "Please enter your name."
        }
      });
      return;
    }

    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT
    });
    try {
      await AuthAPI.signUp({
        email: email,
        password: password,
        repeatPassword: repeatPassword,
        fullName: fullName
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
