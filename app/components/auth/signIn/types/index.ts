import { Dispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { SignInState } from "../reducer";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/reducer";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface SignInContainerProps {
  signInState: SignInState;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
  dispatch: Dispatch<any>;
}

export interface SignInSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
