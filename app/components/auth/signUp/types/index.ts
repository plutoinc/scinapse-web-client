import { DispatchProp } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { SignUpState } from "../reducer";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/reducer";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface ISignUpParams {
  code?: string;
}

export interface ISignUpContainerProps extends DispatchProp<ISignUpContainerMappedState>, RouteComponentProps<any> {
  signUpState: SignUpState;
  handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
}

export interface ISignUpContainerMappedState {
  signUpState: SignUpState;
}

export interface ISignUpSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
