import { DispatchProp } from "react-redux";
import { DialogStateRecord } from "../records";
import { CurrentUser } from "../../../model/currentUser";

export interface IDialogContainerProps extends DispatchProp<IDialogContainerMappedState> {
  dialogState: DialogStateRecord;
  currentUser: CurrentUser;
}

interface IDialogContainerMappedState {
  dialogState: DialogStateRecord;
  currentUser: CurrentUser;
}
