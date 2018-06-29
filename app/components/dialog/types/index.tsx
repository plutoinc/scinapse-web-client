import { Dispatch } from "react-redux";
import { DialogState } from "../reducer";
import { CurrentUser } from "../../../model/currentUser";
import { Collection } from "../../../model/collection";

export interface DialogContainerProps
  extends Readonly<{
      dialogState: DialogState;
      myCollections: Collection[];
      currentUser: CurrentUser;
      dispatch: Dispatch<any>;
    }> {}
