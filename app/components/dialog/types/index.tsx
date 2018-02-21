import { DispatchProp } from "react-redux";
import { DialogStateRecord } from "../records";
import { CurrentUserRecord } from "../../../model/currentUser";

export interface IDialogContainerProps extends DispatchProp<IDialogContainerMappedState> {
  dialogState: DialogStateRecord;
  currentUser: CurrentUserRecord;
}

interface IDialogContainerMappedState {
  dialogState: DialogStateRecord;
  currentUser: CurrentUserRecord;
}
