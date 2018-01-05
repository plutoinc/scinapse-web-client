import { DispatchProp } from "react-redux";
import { RouteProps } from "react-router";
import { IEmailVerificationStateRecord } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";

export interface IEmailVerificationContainerProps extends DispatchProp<IEmailVerificationContainerMappedState> {
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  emailVerificationState: IEmailVerificationStateRecord;
  routing: RouteProps;
}

export interface IEmailVerificationContainerMappedState {
  emailVerificationState: IEmailVerificationStateRecord;
  routing: RouteProps;
}

export interface IEmailVerificationParams {
  token?: string;
  email?: string;
}
