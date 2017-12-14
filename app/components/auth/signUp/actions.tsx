import { Dispatch } from "redux";
import AuthAPI, { IPostExchangeResult } from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { validateEmail } from "../../../helpers/validateEmail";
import { SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP, ISignUpStateRecord, ISignUpOauthInfo } from "./records";
import { OAUTH_VENDOR, IGetAuthorizeUriResult } from "../../../api/auth";
import { closeDialog } from "../../dialog/actions";
import alertToast from "../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../helpers/envChecker";
import { recordify } from "typed-immutable-record";
import { IMemberRecord } from "../../../model/member";
import { push } from "react-router-redux";

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
  if (password === "" || password.length <= 0) {
    return makeFormErrorMessage("password", "Please enter password");
  } else if (password.length < 8) {
    return makeFormErrorMessage("password", "Must have at least 8 characters!");
  } else {
    return removeFormErrorMessage("password");
  }
}

export function changeNameInput(name: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_NAME_INPUT,
    payload: {
      name,
    },
  };
}

export function checkValidNameInput(name: string) {
  // name Validation
  const isNameTooShort = name === "" || name.length <= 0;

  if (isNameTooShort) {
    return makeFormErrorMessage("name", "Please enter name");
  } else {
    return removeFormErrorMessage("name");
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

export function changeSignUpStep(step: SIGN_UP_STEP) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_SIGN_UP_STEP,
    payload: {
      step,
    },
  };
}

export function signUpWithEmail(currentStep: SIGN_UP_STEP, signUpState: ISignUpStateRecord, isDialog: Boolean) {
  return async (dispatch: Dispatch<any>) => {
    const { email, password, affiliation, name } = signUpState;

    switch (currentStep) {
      case SIGN_UP_STEP.FIRST: {
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
        const isPasswordTooShort = password === "" || password.length <= 0 || password.length < 8;

        if (password === "" || password.length <= 0) {
          dispatch(makeFormErrorMessage("password", "Please enter password"));
        } else if (password.length < 8) {
          dispatch(makeFormErrorMessage("password", "Must have at least 8 characters!"));
        } else {
          dispatch(removeFormErrorMessage("password"));
        }

        if (isInValidEmail || isDuplicatedEmail || isPasswordTooShort) return;

        dispatch(changeSignUpStep(SIGN_UP_STEP.WITH_EMAIL));
        dispatch(fixInput("email"));
        break;
      }

      case SIGN_UP_STEP.WITH_EMAIL: {
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
        const isPasswordTooShort = password === "" || password.length <= 0 || password.length < 8;

        if (password === "" || password.length <= 0) {
          dispatch(makeFormErrorMessage("password", "Please enter password"));
        } else if (password.length < 8) {
          dispatch(makeFormErrorMessage("password", "Must have at least 8 characters!"));
        } else {
          dispatch(removeFormErrorMessage("password"));
        }

        // name Validation
        const isNameTooShort = name === "" || name.length <= 0;

        if (isNameTooShort) {
          dispatch(makeFormErrorMessage("name", "Please enter name"));
        } else {
          dispatch(removeFormErrorMessage("name"));
        }

        // affiliation Validation
        const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

        if (isAffiliationTooShort) {
          dispatch(makeFormErrorMessage("affiliation", "Please enter affiliation"));
        } else {
          dispatch(removeFormErrorMessage("affiliation"));
        }

        if (isInValidEmail || isDuplicatedEmail || isPasswordTooShort || isAffiliationTooShort || isNameTooShort)
          return;

        dispatch({
          type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
        });

        try {
          await AuthAPI.signUp({
            email,
            password,
            name,
            affiliation,
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
          if (isDialog) {
            dispatch(closeDialog());
            alertToast({
              type: "success",
              message: "Succeeded to Sign Up!!",
            });
          }
        } catch (err) {
          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
        }
        break;
      }

      default:
        break;
    }
  };
}

export function signUpWithSocial(
  currentStep: SIGN_UP_STEP,
  signUpState: ISignUpStateRecord,
  vendor: OAUTH_VENDOR,
  isDialog: Boolean,
) {
  return async (dispatch: Dispatch<any>) => {
    switch (currentStep) {
      case SIGN_UP_STEP.FIRST: {
        if (!vendor) return;
        try {
          const origin = EnvChecker.getOrigin();
          const redirectUri = `${origin}/users/sign_up?vendor=${vendor}`;
          const authorizeUriData: IGetAuthorizeUriResult = await AuthAPI.getAuthorizeUri({
            vendor,
            redirectUri,
          });

          window.location.replace(authorizeUriData.uri);
        } catch (err) {
          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
        }
        break;
      }

      case SIGN_UP_STEP.WITH_SOCIAL: {
        const { email, affiliation, name, oauth } = signUpState;

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

        // name Validation
        const isNameTooShort = name === "" || name.length <= 0;

        if (isNameTooShort) {
          dispatch(makeFormErrorMessage("name", "Please enter name"));
        } else {
          dispatch(removeFormErrorMessage("name"));
        }

        // affiliation Validation
        const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

        if (isAffiliationTooShort) {
          dispatch(makeFormErrorMessage("affiliation", "Please enter affiliation"));
        } else {
          dispatch(removeFormErrorMessage("affiliation"));
        }

        if (isInValidEmail || isDuplicatedEmail || isNameTooShort || isAffiliationTooShort) return;

        dispatch({
          type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
        });

        try {
          const signUpResult: IMemberRecord = await AuthAPI.signUp({
            email,
            name,
            affiliation,
            oauth: {
              oauthId: oauth.oauthId,
              uuid: oauth.uuid,
              vendor: oauth.vendor,
            },
          });

          dispatch({
            type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
          });

          dispatch({
            type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
            payload: {
              user: signUpResult,
            },
          });

          if (isDialog) {
            dispatch(closeDialog());
            alertToast({
              type: "success",
              message: "Succeeded to Sign Up!!",
            });
          } else {
            dispatch(push("/"));
            alertToast({
              type: "success",
              message: "Succeeded to Sign Up!!",
            });
          }
        } catch (err) {
          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
        }
        break;
      }

      default:
        break;
    }
  };
}

export function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.SIGN_UP_GET_AUTHORIZE_CODE,
    });

    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_EXCHANGE,
    });

    try {
      const origin = EnvChecker.getOrigin();
      const redirectUri = `${origin}/users/sign_up?vendor=${vendor}`;

      const postExchangeData: IPostExchangeResult = await AuthAPI.postExchange({
        code,
        vendor,
        redirectUri,
      });

      if (!!postExchangeData.userData.name) {
        dispatch(fixInput("name"));
      }

      if (!!postExchangeData.userData.email) {
        dispatch(fixInput("email"));
      }

      const recordifiedOauth: ISignUpOauthInfo = recordify({
        code,
        oauthId: postExchangeData.oauthId,
        uuid: postExchangeData.uuid,
        vendor,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE,
        payload: {
          vendor,
          email: postExchangeData.userData.email || "",
          name: postExchangeData.userData.name || "",
          oauth: recordifiedOauth,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
      });
    }
  };
}

export function fixInput(inputField: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_FIX_INPUT,
    payload: {
      inputField,
    },
  };
}

export function goBack() {
  return {
    type: ACTION_TYPES.SIGN_UP_GO_BACK,
  };
}
