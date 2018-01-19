import { DispatchProp } from "react-redux";
import { ILayoutStateRecord } from "../records";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { RouteProps } from "react-router-dom";
import { IArticleSearchStateRecord } from "../../articleSearch/records";

export interface IHeaderProps extends DispatchProp<IHeaderMappedState> {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

interface IHeaderMappedState {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}
