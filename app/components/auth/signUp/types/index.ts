import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "react-redux";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/reducer";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

export interface SignUpContainerProps extends RouteComponentProps<SignUpSearchParams> {
  dispatch: Dispatch<any>;
  handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
  userActionType: Scinapse.ActionTicket.ActionTagType | undefined;
}

export interface SignUpSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}

export enum SIGN_UP_STEP {
  FIRST,
  WITH_EMAIL,
  WITH_SOCIAL,
  FINAL_WITH_EMAIL,
  FINAL_WITH_SOCIAL,
}
