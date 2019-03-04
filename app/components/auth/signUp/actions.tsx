import { Dispatch } from "redux";
import * as ReactGA from "react-ga";
import AuthAPI from "../../../api/auth";
import {
  PostExchangeResult,
  OAUTH_VENDOR,
  GetAuthorizeUriResult,
  SignUpWithEmailParams,
} from "../../../api/types/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import validateEmail from "../../../helpers/validateEmail";
import { SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP, SignUpState, SignUpOauthInfo, SignUpErrorCheck } from "./reducer";
import { closeDialog } from "../../dialog/actions";
import alertToast from "../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../helpers/envChecker";
import { Member } from "../../../model/member";
import { trackEvent, trackDialogView } from "../../../helpers/handleGA";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
    payload: {
      email,
    },
  };
}

export const checkDuplicatedEmail = async (email: string) => {
  const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);
  if (checkDuplicatedEmailResult.duplicated) {
    return "Email address already exists";
  }
  return null;
};

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function changeFirstNameInput(name: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_FIRST_NAME_INPUT,
    payload: {
      name,
    },
  };
}

export function changeLastNameInput(name: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_LASTNAME_INPUT,
    payload: {
      name,
    },
  };
}

export function checkValidNameInput(name: string, type: keyof SignUpErrorCheck) {
  if (name.length === 0) {
    return makeFormErrorMessage(type, `Please enter ${type}`);
  } else {
    return removeFormErrorMessage(type);
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
  const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

  if (isAffiliationTooShort) {
    return makeFormErrorMessage("affiliation", "Please enter affiliation");
  } else {
    return removeFormErrorMessage("affiliation");
  }
}

export function makeFormErrorMessage(type: keyof SignUpErrorCheck, errorMessage: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
    payload: {
      type,
      errorMessage,
    },
  };
}

export function removeFormErrorMessage(type: keyof SignUpErrorCheck) {
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

export function signUpWithEmail(params: SignUpWithEmailParams) {
  return async (dispatch: Dispatch<any>) => {
    trackEvent({ category: "sign_up", action: "try_to_sign_up", label: "with_email" });
    try {
      const signUpResult: Member = await AuthAPI.signUpWithEmail(params);
      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signUpResult,
          loggedIn: true,
          oauthLoggedIn: false,
        },
      });
      alertToast({
        type: "success",
        message: "Succeeded to Sign Up!!",
      });
      trackEvent({ category: "sign_up", action: "succeed_to_sign_up", label: "with_email" });
    } catch (err) {
      trackEvent({ category: "sign_up", action: "failed_to_sign_up", label: "with_email" });
      alertToast({
        type: "error",
        message: `Failed to sign up with email.`,
      });
      throw err;
    }
    // case SIGN_UP_STEP.FINAL_WITH_EMAIL: {
    //   if (isDialog) {
    //     dispatch(closeDialog());
    //     trackDialogView("signUpWithEmailClose");
    //   }
    //   break;
  };
}

export function signUpWithSocial(currentStep: SIGN_UP_STEP, vendor: OAUTH_VENDOR, signUpState?: SignUpState) {
  return async (dispatch: Dispatch<any>) => {
    switch (currentStep) {
      case SIGN_UP_STEP.FIRST: {
        if (!vendor) {
          throw new Error();
        }
        try {
          const origin = EnvChecker.getOrigin();
          const redirectURI = `${origin}/users/sign_up?vendor=${vendor}`;
          const authorizeUriData: GetAuthorizeUriResult = await AuthAPI.getAuthorizeURI({
            vendor,
            redirectURI,
          });

          trackEvent({ category: "sign_up", action: "try_to_sign_up_step_1", label: `with_${vendor}` });

          if (!EnvChecker.isOnServer()) {
            ReactGA.set({ referrer: origin });
            window.location.replace(authorizeUriData.uri);
          }
        } catch (err) {
          alertToast({
            type: "error",
            message: `Failed to sign up with social account.`,
          });

          trackEvent({ category: "sign_up", action: "failed_to_sign_up_step_1", label: `with_${vendor}` });

          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
          throw err;
        }
        break;
      }

      case SIGN_UP_STEP.WITH_SOCIAL: {
        if (signUpState) {
          const { email, affiliation, firstName, oauth, lastName } = signUpState;

          dispatch({
            type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
          });

          trackEvent({ category: "sign_up", action: "try_to_sign_up", label: `with_${vendor}` });

          try {
            const signUpResult: Member = await AuthAPI.signUpWithSocial({
              email,
              firstName,
              affiliation,
              lastName,
              oauth: {
                oauthId: oauth!.oauthId,
                uuid: oauth!.uuid,
                vendor: oauth!.vendor!,
              },
            });

            dispatch({
              type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
            });

            trackEvent({ category: "sign_up", action: "succeed_to_sign_up", label: `with_${vendor}` });

            // Auto Sign in after Sign up at API Server. So we don't need to call sign in api again.
            dispatch({
              type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
              payload: {
                user: signUpResult,
                loggedIn: true,
                oauthLoggedIn: true, // Because this method is signUpWithSocial
              },
            });
          } catch (err) {
            alertToast({
              type: "error",
              message: `Failed to sign up!`,
            });
            trackEvent({ category: "sign_up", action: "failed_to_sign_up", label: `with_${vendor}` });
            dispatch({
              type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
            });
            throw err;
          }
        }
        break;
      }

      default:
        break;
    }
  };
}

export function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR, alreadySignUpCB: () => void) {
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

      const postExchangeData: PostExchangeResult = await AuthAPI.postExchange({
        code,
        vendor,
        redirectUri,
      });

      if (postExchangeData.connected) {
        alertToast({
          type: "error",
          message: "You already did sign up with this account.",
        });
        dispatch({
          type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
        });
        alreadySignUpCB();
        return;
      }

      const oAuth: SignUpOauthInfo = {
        code,
        oauthId: postExchangeData.oauthId,
        uuid: postExchangeData.uuid,
        vendor,
      };

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE,
        payload: {
          vendor,
          email: postExchangeData.userData.email || "",
          firstName: postExchangeData.userData.name || "",
          lastName: "",
          oauth: oAuth,
        },
      });
    } catch (_err) {
      alertToast({
        type: "error",
        message: `Failed to sign up with social account.`,
      });
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
      });
      dispatch(goBack());
    }
  };
}

export function goBack() {
  return {
    type: ACTION_TYPES.SIGN_UP_GO_BACK,
  };
}
