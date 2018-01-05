import { OAUTH_VENDOR } from "../../../../api/auth";
import { RouteProps } from "react-router";
import { ISignUpStateRecord } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";
import { DispatchProp } from "react-redux";

export interface ISignUpParams {
  code?: string;
}

export interface ISignUpContainerProps extends DispatchProp<ISignUpContainerMappedState> {
  signUpState: ISignUpStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
}

export interface ISignUpContainerMappedState {
  signUpState: ISignUpStateRecord;
  routing: RouteProps;
}

export interface ISignUpSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
