import { Dispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { EmailVerificationState } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";

export interface EmailVerificationContainerProps {
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  emailVerificationState: EmailVerificationState;
  dispatch: Dispatch<any>;
  routing: RouteProps;
}

export interface EmailVerificationParams {
  token?: string;
  email?: string;
}
