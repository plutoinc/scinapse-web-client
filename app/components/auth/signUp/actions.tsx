import { Dispatch } from "redux";
import AuthAPI from "../../../api/auth";
import { PostExchangeResult, OAUTH_VENDOR, SignUpWithEmailParams } from "../../../api/types/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { SignUpOauthInfo } from "./reducer";
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
      // go back
    }
  };
}
