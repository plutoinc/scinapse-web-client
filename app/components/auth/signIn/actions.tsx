import { Dispatch } from "redux";
import AuthAPI, { OAUTH_VENDOR, IGetAuthorizeUriResult, ISignInParams } from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { validateEmail } from "../../../helpers/validateEmail";
import { SIGN_IN_ON_FOCUS_TYPE } from "./records";
import { closeDialog } from "../../dialog/actions";
import EnvChecker from "../../../helpers/envChecker";
import { push } from "react-router-redux";
import alertToast from "../../../helpers/makePlutoToastAction";

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

export function signIn(params: ISignInParams, isDialog: Boolean) {
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
        if (isDialog) {
          dispatch(closeDialog());
        } else {
          dispatch(push("/"));
        }
        alertToast({
          type: "success",
          message: "Succeeded to Sign In!!",
        });
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

export async function signInWithSocial(vendor: OAUTH_VENDOR) {
  if (!vendor) return;

  try {
    const origin = EnvChecker.getOrigin();
    const redirectUri = `${origin}/users/sign_in?vendor=${vendor}`;
    const authorizeUriData: IGetAuthorizeUriResult = await AuthAPI.getAuthorizeUri({
      vendor,
      redirectUri,
    });

    window.location.replace(authorizeUriData.uri);
  } catch (err) {
    console.error(err);
  }
}

export function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR, isDialog: Boolean) {
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
      const signInResult = await AuthAPI.signInWithSocial({
        code,
        vendor,
        redirectUri,
      });

      if (signInResult.loggedIn) {
        if (isDialog) {
          dispatch(closeDialog());
        } else {
          dispatch(push("/"));
        }
        alertToast({
          type: "success",
          message: "Succeeded to Sign In!!",
        });
        dispatch({
          type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
          payload: {
            user: signInResult.member,
          },
        });
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      console.dir(err);
      const errorEvent = new ErrorEvent(err);
      console.log(errorEvent);

      if (err.code === 401) {
        dispatch({
          type: ACTION_TYPES.SIGN_IN_FAILED_UNSIGNED_WITH_SOCIAL,
        });
      }
      dispatch({
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
      });
    }
  };
}

export function goBack() {
  return {
    type: ACTION_TYPES.SIGN_IN_GO_BACK,
  };
}
