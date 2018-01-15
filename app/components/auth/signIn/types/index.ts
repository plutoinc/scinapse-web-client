import { DispatchProp } from "react-redux";
import { ISignInStateRecord } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";
import { RouteProps } from "react-router";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface ISignInContainerProps extends DispatchProp<ISignInContainerMappedState> {
  signInState: ISignInStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
}

export interface ISignInContainerMappedState {
  signInState: ISignInStateRecord;
  routing: RouteProps;
}

export interface ISignInSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
