import { Dispatch } from "react-redux";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import AuthAPI, { IVerifyEmailResult } from "../../../api/auth";
import alertToast from "../../../helpers/makePlutoToastAction";

export function verifyToken(token: string) {
  return async (dispatch: Dispatch<Function>) => {
    dispatch({
      type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN,
    });

    try {
      const verifyEmailResult: IVerifyEmailResult = await AuthAPI.verifyToken(token);

      if (!verifyEmailResult.success) {
        throw new Error("Server result is failed");
      }

      alertToast({
        type: "success",
        message: "Succeeded to email verification!!",
      });

      dispatch({
        type: ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN,
      });
    } catch (err) {
      alert(`Failed to email verification! ${err}`);
      dispatch({
        type: ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN,
      });
    }
  };
}

export function resendVerificationEmail(email: string) {
  return async (dispatch: Dispatch<Function>) => {
    dispatch({
      type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL,
    });

    try {
      const resendVerificationEmailResult: IVerifyEmailResult = await AuthAPI.resendVerificationEmail(email);

      if (!resendVerificationEmailResult.success) {
        throw new Error("Server result is failed");
      }

      alertToast({
        type: "success",
        message: "Succeeded to resend verification email!!",
      });

      dispatch({
        type: ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL,
      });
    } catch (err) {
      alert(`Failed to resend verification email! ${err}`);
      dispatch({
        type: ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL,
      });
    }
  };
}
