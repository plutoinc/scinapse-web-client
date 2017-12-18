import { Dispatch } from "react-redux";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import AuthAPI, { IVerifyEmailResult } from "../../../api/auth";
import { closeDialog } from "../../dialog/actions";
import { push } from "react-router-redux";
import alertToast from "../../../helpers/makePlutoToastAction";

export function verifyToken(token: string, isDialog: Boolean) {
  return async (dispatch: Dispatch<Function>) => {
    dispatch({
      type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN,
    });

    try {
      const verifyEmailResult: IVerifyEmailResult = await AuthAPI.verifyToken(token);

      if (!verifyEmailResult.success) {
        throw new Error("Server result is failed");
      }

      if (isDialog) {
        dispatch(closeDialog());
      } else {
        dispatch(push("/"));
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
