import { DispatchProp } from "react-redux";
import { IDialogStateRecord } from "../records";
import { ICurrentUserRecord } from "../../../model/currentUser";

export interface IDialogContainerProps extends DispatchProp<IDialogContainerMappedState> {
  dialogState: IDialogStateRecord;
  currentUser: ICurrentUserRecord;
}

interface IDialogContainerMappedState {
  dialogState: IDialogStateRecord;
  currentUser: ICurrentUserRecord;
}
