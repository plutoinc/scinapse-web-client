import { DispatchProp } from "react-redux";
import { ILayoutStateRecord } from "../records";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { RouteProps } from "react-router-dom";
import { IArticleSearchStateRecord } from "../../articleSearch/records";

export interface HeaderProps extends DispatchProp<HeaderMappedState> {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

export interface HeaderMappedState {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}
