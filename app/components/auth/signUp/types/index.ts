import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "react-redux";
import { SignUpState } from "../reducer";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/reducer";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface SignUpContainerProps extends RouteComponentProps<SignUpSearchParams> {
  signUpState: SignUpState;
  dispatch: Dispatch<any>;
  handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
}

export interface SignUpContainerMappedState {
  signUpState: SignUpState;
}

export interface SignUpSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
