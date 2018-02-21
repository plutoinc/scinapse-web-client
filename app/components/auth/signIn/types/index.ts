import { DispatchProp } from "react-redux";
import { SignInStateRecord } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";
import { RouteProps } from "react-router-dom";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface ISignInContainerProps extends DispatchProp<ISignInContainerMappedState> {
  signInState: SignInStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
}

export interface ISignInContainerMappedState {
  signInState: SignInStateRecord;
  routing: RouteProps;
}

export interface ISignInSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
