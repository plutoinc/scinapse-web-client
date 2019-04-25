import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "react-redux";
import { DialogState } from "../reducer";
import { CurrentUser } from "../../../model/currentUser";
import { Collection } from "../../../model/collection";
import { ArticleSearchState } from "../../articleSearch/records";

export interface DialogContainerProps
  extends Readonly<{
      dialogState: DialogState;
      myCollections: Collection[];
      currentUser: CurrentUser;
      dispatch: Dispatch<any>;
      articleSearch: ArticleSearchState;
    }>,
    RouteComponentProps<null> {}
