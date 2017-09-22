import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { validateEmail } from "../../../helpers/validateEmail";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
    payload: {
      email,
    },
  };
}

export function checkValidEmailInput(email: string) {
  // e-mail empty check && e-mail validation by regular expression
  if (!validateEmail(email)) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "email",
        content: "Please enter a valid email address",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
    };
  }
}

export function checkDuplicatedEmail(email: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const result = await AuthAPI.checkDuplicatedEmail(email);
      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
      });
      if (result.duplicated) {
        dispatch({
          type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
          payload: {
            type: "email",
            content: "Email address already exists",
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
      });
    }
  };
}

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function checkValidPasswordInput(password: string) {
  // Password empty check
  if (password === "" || password.length <= 0) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "password",
        content: "Please enter password",
      },
    };
  } else if (password.length < 6) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "password",
        content: "Must have at least 6 characters!",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
    };
  }
}

export function changeRepeatPasswordInput(repeatPassword: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT,
    payload: {
      repeatPassword,
    },
  };
}

export function checkValidRepeatPasswordInput(password: string, repeatPassword: string) {
  // repeat password Validation
  if (repeatPassword === "" || repeatPassword.length <= 0) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "repeatPassword",
        content: "Please re-enter your password",
      },
    };
  } else if (password !== repeatPassword) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "repeatPassword",
        content: "It is not the same as the password you entered previously.",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
    };
  }
}

export function changeFullNameInput(fullName: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_FULL_NAME_INPUT,
    payload: {
      fullName,
    },
  };
}

export function checkValidFullNameInput(fullName: string) {
  // fullName empty check
  if (fullName === "" || fullName.length < 2) {
    return {
      type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
      payload: {
        type: "fullName",
        content: "Please enter your name.",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
    };
  }
}

export function removeFormErrorMessage() {
  return {
    type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
  };
}

export interface ICreateNewAccountParams {
  email: string;
  password: string;
  repeatPassword: string;
  fullName: string;
}

export function createNewAccount(params: ICreateNewAccountParams, isDialog: boolean) {
  return async (dispatch: Dispatch<any>) => {
    const { email, password, repeatPassword, fullName } = params;
    // e-mail empty check && e-mail validation by regular expression
    if (!validateEmail(email)) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "email",
          content: "Please enter a valid email address",
        },
      });
      return;
    }
    // Password empty check
    if (password === "" || password.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "password",
          content: "Please enter password",
        },
      });
      return;
    } else if (password.length < 6) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "password",
          content: "Must have at least 6 characters!",
        },
      });
      return;
    }

    // repeat password Validation
    if (repeatPassword === "" || repeatPassword.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "repeatPassword",
          content: "Please re-enter your password",
        },
      });
      return;
    } else if (password !== repeatPassword) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "repeatPassword",
          content: "It is not the same as the password you entered previously.",
        },
      });
      return;
    }

    // fullName empty check
    if (fullName === "" || fullName.length <= 0) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: "fullName",
          content: "Please enter your name.",
        },
      });
      return;
    }

    try {
      const result = await AuthAPI.checkDuplicatedEmail(email);
      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
      });
      if (result.duplicated) {
        dispatch({
          type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
          payload: {
            type: "email",
            content: "Email address already exists",
          },
        });
        return;
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
      });
      return;
    }

    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
    });
    try {
      await AuthAPI.signUp({
        email,
        password,
        repeatPassword,
        fullName,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
      });

      const recordedCurrentUser = await AuthAPI.signIn({
        email,
        password,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: {
            email: recordedCurrentUser.email,
            memberId: 3223,
            nickName: "23",
            password: "3232",
          },
        },
      });

      if (!isDialog) {
        dispatch(push("wallet"));
      } else {
        dispatch({
          type: ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE,
          payload: {
            type: GLOBAL_DIALOG_TYPE.WALLET,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
      });
    }
  };
}
