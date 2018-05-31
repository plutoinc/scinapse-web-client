import { DispatchProp } from "react-redux";
import { DialogState } from "../reducer";
import { CurrentUser } from "../../../model/currentUser";

export interface DialogContainerProps extends DispatchProp<DialogContainerMappedState> {
  dialogState: DialogState;
  currentUser: CurrentUser;
}

interface DialogContainerMappedState {
  dialogState: DialogState;
  currentUser: CurrentUser;
}
