import { Dispatch } from "redux";
import * as ReactGA from "react-ga";
import AuthAPI from "../../../api/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { closeDialog } from "../../dialog/actions";
import EnvChecker from "../../../helpers/envChecker";
import alertToast from "../../../helpers/makePlutoToastAction";
import { SignInWithEmailParams, SignInResult, OAUTH_VENDOR, GetAuthorizeUriResult } from "../../../api/types/auth";
import { trackDialogView } from "../../../helpers/handleGA";
import PlutoAxios from "../../../api/pluto";

export function signInWithEmail(params: SignInWithEmailParams, isDialog: boolean) {
  return async (dispatch: Dispatch<any>) => {
    const { email, password } = params;

    try {
      const signInResult: SignInResult = await AuthAPI.signInWithEmail({ email, password });

      if (isDialog) {
        dispatch(closeDialog());
        trackDialogView("signInWithEmailClose");
      }

      alertToast({
        type: "success",
        message: "Welcome to Scinapse",
      });

      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signInResult.member,
          loggedIn: signInResult.loggedIn,
          oauthLoggedIn: signInResult.oauthLoggedIn,
        },
      });

      return signInResult;
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to sign in.`,
      });
      const error = PlutoAxios.getGlobalError(err);
      throw error;
    }
  };
}

export async function signInWithSocial(vendor: OAUTH_VENDOR, redirectURI: string) {
  try {
    const authorizeUriData: GetAuthorizeUriResult = await AuthAPI.getAuthorizeURI({
      vendor,
      redirectURI,
    });

    if (!EnvChecker.isOnServer()) {
      ReactGA.set({ referrer: EnvChecker.getOrigin() });
    }

    return authorizeUriData;
  } catch (err) {
    alertToast({
      type: "error",
      message: `Failed to sign in.`,
    });
    throw err;
  }
}

export function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR, redirectURI: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const signInResult: SignInResult = await AuthAPI.signInWithSocial({
        code,
        vendor,
        redirectURI,
      });

      alertToast({
        type: "success",
        message: "Welcome to Scinapse.",
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
        message: `Failed to sign in.`,
      });
      throw err;
    }
  };
}
