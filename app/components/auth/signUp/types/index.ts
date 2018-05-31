import { DispatchProp } from "react-redux";
import { RouteProps } from "react-router-dom";
import { SignUpState } from "../reducer";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/reducer";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface ISignUpParams {
  code?: string;
}

export interface ISignUpContainerProps extends DispatchProp<ISignUpContainerMappedState> {
  signUpState: SignUpState;
  handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
}

export interface ISignUpContainerMappedState {
  signUpState: SignUpState;
  routing: RouteProps;
}

export interface ISignUpSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
