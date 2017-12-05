import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { validateEmail } from "../../../helpers/validateEmail";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import { SIGN_UP_ON_FOCUS_TYPE } from "./records";

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
  const isInValidEmail: boolean = !validateEmail(email);

  if (isInValidEmail) {
    return makeFormErrorMessage("email", "Please enter a valid email address");
  } else {
    return removeFormErrorMessage("email");
  }
}

export function checkDuplicatedEmail(email: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
      });
      if (checkDuplicatedEmailResult.duplicated) {
        dispatch(makeFormErrorMessage("email", "Email address already exists"));
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
      });
      dispatch(removeFormErrorMessage("password"));
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
  const isPasswordTooShort = password === "" || password.length <= 0;
  if (isPasswordTooShort) {
    return makeFormErrorMessage("password", "Please enter password");
  } else if (password.length < 8) {
    return makeFormErrorMessage("password", "Must have at least 8 characters!");
  } else {
    return removeFormErrorMessage("password");
  }
}

export function changeAffiliationInput(affiliation: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT,
    payload: {
      affiliation,
    },
  };
}

export function checkValidAffiliationInput(affiliation: string) {
  // affiliation Validation
  const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

  if (isAffiliationTooShort) {
    return makeFormErrorMessage("affiliation", "Please enter affiliation");
  } else {
    return removeFormErrorMessage("affiliation");
  }
}

export function changeAffiliationEmailInput(affiliationEmail: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_EMAIL_INPUT,
    payload: {
      affiliationEmail,
    },
  };
}

export function makeFormErrorMessage(type: string, errorMessage: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
    payload: {
      type,
      errorMessage,
    },
  };
}

export function removeFormErrorMessage(type: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
    payload: {
      type,
    },
  };
}

export function onFocusInput(type: SIGN_UP_ON_FOCUS_TYPE) {
  return {
    type: ACTION_TYPES.SIGN_UP_ON_FOCUS_INPUT,
    payload: {
      type,
    },
  };
}

export function onBlurInput() {
  return {
    type: ACTION_TYPES.SIGN_UP_ON_BLUR_INPUT,
  };
}

export interface ICreateNewAccountParams {
  email: string;
  password: string;
  affiliation: string;
  affiliationEmail: string;
}

export function createNewAccount(params: ICreateNewAccountParams, isDialog: boolean) {
  return async (dispatch: Dispatch<any>) => {
    const { email, password, affiliation, affiliationEmail } = params;

    // e-mail empty check && e-mail validation by regular expression
    const isInValidEmail: boolean = !validateEmail(email);

    if (isInValidEmail) {
      dispatch(makeFormErrorMessage("email", "Please enter a valid email address"));
    } else {
      dispatch(removeFormErrorMessage("email"));
    }

    // Duplicated Email Check
    let isDuplicatedEmail: boolean = false;

    if (!isInValidEmail) {
      try {
        const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

        dispatch({
          type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
        });

        if (checkDuplicatedEmailResult.duplicated) {
          dispatch(makeFormErrorMessage("email", "Email address already exists"));
          isDuplicatedEmail = true;
        } else {
          dispatch(removeFormErrorMessage("password"));
        }
      } catch (err) {
        // TODO : network err Notification
        dispatch({
          type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
        });
      }
    }

    // Password empty check
    const isPasswordTooShort = password === "" || password.length <= 0;

    if (isPasswordTooShort) {
      dispatch(makeFormErrorMessage("password", "Please enter password"));
    } else if (password.length < 8) {
      dispatch(makeFormErrorMessage("password", "Must have at least 8 characters!"));
    } else {
      dispatch(removeFormErrorMessage("password"));
    }

    // affiliation Validation
    const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

    if (isAffiliationTooShort) {
      dispatch(makeFormErrorMessage("affiliation", "Please enter affiliation"));
    } else {
      dispatch(removeFormErrorMessage("affiliation"));
    }

    if (isInValidEmail || isDuplicatedEmail || isPasswordTooShort || isAffiliationTooShort) return;

    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
    });

    try {
      await AuthAPI.signUp({
        email,
        password,
        affiliation,
        affiliationEmail,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
      });

      const signInResult = await AuthAPI.signIn({
        email,
        password,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signInResult.member,
        },
      });

      if (!isDialog) {
        dispatch(push("/users/wallet"));
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
