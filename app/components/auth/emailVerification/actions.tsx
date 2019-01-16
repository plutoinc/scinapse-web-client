import { Dispatch } from "react-redux";
import { push } from "connected-react-router";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import AuthAPI from "../../../api/auth";
import { VerifyEmailResult } from "../../../api/types/auth";
import alertToast from "../../../helpers/makePlutoToastAction";
import { closeDialog } from "../../dialog/actions";
import { trackDialogView } from "../../../helpers/handleGA";

export function verifyToken(token: string) {
  return async (dispatch: Dispatch<Function>) => {
    dispatch({
      type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN,
    });

    try {
      const verifyEmailResult: VerifyEmailResult = await AuthAPI.verifyToken(token);

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
      alertToast({
        type: "error",
        message: `Failed to verification. ${err}`,
      });
      dispatch({
        type: ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN,
      });
    }
  };
}

export function resendVerificationEmail(email: string, isDialog: boolean) {
  return async (dispatch: Dispatch<Function>) => {
    dispatch({
      type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL,
    });

    try {
      const resendVerificationEmailResult: VerifyEmailResult = await AuthAPI.resendVerificationEmail(email);

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

      if (isDialog) {
        dispatch(closeDialog());
        trackDialogView("resendVerificationEmailClose");
      } else {
        dispatch(push("/"));
      }
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to resend email verification. ${err}`,
      });
      dispatch({
        type: ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL,
      });
    }
  };
}
