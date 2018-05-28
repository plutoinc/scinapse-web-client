import { Dispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { SignInStateRecord } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/records";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface SignInContainerProps {
  signInState: SignInStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
  dispatch: Dispatch<any>;
}

export interface SignInSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}
