import { Dispatch } from "react-redux";
import { DialogState } from "../reducer";
import { CurrentUser } from "../../../model/currentUser";

export interface DialogContainerProps
  extends Readonly<{
      dialogState: DialogState;
      currentUser: CurrentUser;
      dispatch: Dispatch<any>;
    }> {}
