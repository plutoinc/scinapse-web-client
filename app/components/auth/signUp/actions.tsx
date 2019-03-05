import { Dispatch } from "redux";
import AuthAPI from "../../../api/auth";
import {
  PostExchangeResult,
  OAUTH_VENDOR,
  SignUpWithEmailParams,
  SignUpWithSocialParams,
} from "../../../api/types/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import alertToast from "../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../helpers/envChecker";
import { Member } from "../../../model/member";
import { trackEvent } from "../../../helpers/handleGA";

export const checkDuplicatedEmail = async (email: string) => {
  const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);
  if (checkDuplicatedEmailResult.duplicated) {
    return "Email address already exists";
  }
  return null;
};

export function signUpWithSocial(params: SignUpWithSocialParams, vendor: OAUTH_VENDOR) {
  return async (dispatch: Dispatch<any>) => {
    trackEvent({ category: "sign_up", action: "try_to_sign_up", label: `with_${vendor}` });
    try {
      const signUpResult: Member = await AuthAPI.signUpWithSocial(params);
      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
      });
      trackEvent({ category: "sign_up", action: "succeed_to_sign_up", label: `with_${vendor}` });
      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signUpResult,
          loggedIn: true,
          oauthLoggedIn: true,
        },
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to sign up!`,
      });
      trackEvent({ category: "sign_up", action: "failed_to_sign_up", label: `with_${vendor}` });
      throw err;
    }
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
  };
}

export async function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR, alreadySignUpCB: () => void) {
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
      alreadySignUpCB();
      return;
    }

    return {
      email: postExchangeData.userData.email,
      oauthId: postExchangeData.oauthId,
      uuid: postExchangeData.uuid,
      vendor,
    };
  } catch (err) {
    alertToast({
      type: "error",
      message: `Failed to sign up with social account.`,
    });
  }
}
