import { DispatchProp } from "react-redux";
import { RouteProps } from "react-router-dom";
import { SignUpStateRecord } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface ISignUpParams {
  code?: string;
}

export interface ISignUpContainerProps extends DispatchProp<ISignUpContainerMappedState> {
  signUpState: SignUpStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
}

export interface ISignUpContainerMappedState {
  signUpState: SignUpStateRecord;
  routing: RouteProps;
}

export interface ISignUpSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
