import { Dispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { EmailVerificationStateRecord } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";

export interface EmailVerificationContainerProps {
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  emailVerificationState: EmailVerificationStateRecord;
  dispatch: Dispatch<any>;
  routing: RouteProps;
}

export interface EmailVerificationParams {
  token?: string;
  email?: string;
}
