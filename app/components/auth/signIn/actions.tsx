import { Dispatch } from "redux";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import validateEmail from "../../../helpers/validateEmail";
import { SIGN_IN_ON_FOCUS_TYPE } from "./reducer";
import { closeDialog } from "../../dialog/actions";
import EnvChecker from "../../../helpers/envChecker";
import { push } from "react-router-redux";
import alertToast from "../../../helpers/makePlutoToastAction";
import { AxiosError } from "axios";
import { ISignInWithEmailParams, ISignInResult, OAUTH_VENDOR, IGetAuthorizeUriResult } from "../../../api/types/auth";
import { trackModalView } from "../../../helpers/handleGA";

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

export function signInWithEmail(params: ISignInWithEmailParams, isDialog: boolean) {
  return async (dispatch: Dispatch<Function>) => {
    const { email, password } = params;

    if (!validateEmail(email)) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR,
      });
      return;
    }

    const isPasswordTooShort = password === "" || password.length <= 0 || password.length < 8;
    if (isPasswordTooShort) {
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR,
      });
      return;
    }

    dispatch({
      type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN,
    });

    try {
      const signInResult: ISignInResult = await AuthAPI.signInWithEmail({
        email: params.email,
        password: params.password,
      });

      if (isDialog) {
        dispatch(closeDialog());
        trackModalView("signInWithEmailClose");
      } else {
        dispatch(push("/"));
      }
      alertToast({
        type: "success",
        message: "Welcome to sci-napse.",
      });
      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signInResult.member,
          loggedIn: signInResult.loggedIn,
          oauthLoggedIn: signInResult.oauthLoggedIn,
        },
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to sign in. ${err}`,
      });
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
      });
    }
  };
}

export async function signInWithSocial(vendor: OAUTH_VENDOR) {
  if (!vendor) {
    return;
  }

  try {
    const origin = EnvChecker.getOrigin();
    const redirectUri = `${origin}/users/sign_in?vendor=${vendor}`;
    const authorizeUriData: IGetAuthorizeUriResult = await AuthAPI.getAuthorizeUri({
      vendor,
      redirectUri,
    });
    if (!EnvChecker.isServer()) {
      window.location.replace(authorizeUriData.uri);
    }
  } catch (err) {
    alertToast({
      type: "error",
      message: `Failed to sign in. ${err}`,
    });
  }
}

export function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR, oauthRedirectPath: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.SIGN_IN_GET_AUTHORIZE_CODE,
    });

    dispatch({
      type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN,
    });

    try {
      const origin = EnvChecker.getOrigin();
      const redirectUri = `${origin}/users/sign_in?vendor=${vendor}`;
      const signInResult: ISignInResult = await AuthAPI.signInWithSocial({
        code,
        vendor,
        redirectUri,
      });

      if (
        !!oauthRedirectPath &&
        !oauthRedirectPath.includes("users/sign_in") &&
        !oauthRedirectPath.includes("users/sign_up")
      ) {
        dispatch(push(oauthRedirectPath));
      } else {
        dispatch(push("/"));
      }

      alertToast({
        type: "success",
        message: "Welcome to sci-napse.",
      });
      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signInResult.member,
          loggedIn: signInResult.loggedIn,
          oauthLoggedIn: signInResult.oauthLoggedIn,
        },
      });
    } catch (err) {
      const errObject: AxiosError = err as AxiosError;
      if (errObject.response) {
        const errCode = errObject.response.status;

        if (errCode === 401) {
          dispatch({
            type: ACTION_TYPES.SIGN_IN_FAILED_DUE_TO_NOT_UNSIGNED_UP_WITH_SOCIAL,
          });
        } else {
          alertToast({
            type: "error",
            message: `Failed to sign in. ${err}`,
          });
          dispatch({
            type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
          });
        }
      }
    }
  };
}

export function goBack() {
  return {
    type: ACTION_TYPES.SIGN_IN_GO_BACK,
  };
}
