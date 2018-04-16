import { DispatchProp } from "react-redux";
import { LayoutStateRecord } from "../records";
import { CurrentUserRecord } from "../../../model/currentUser";
import { RouteProps } from "react-router-dom";
import { ArticleSearchStateRecord } from "../../articleSearch/records";
import { BookmarkRecord } from "../../../model/bookmark";

export interface HeaderProps extends DispatchProp<HeaderMappedState> {
  layoutState: LayoutStateRecord;
  currentUserState: CurrentUserRecord;
  routing: RouteProps;
  articleSearchState: ArticleSearchStateRecord;
  bookmark: BookmarkRecord;
}

export interface HeaderMappedState {
  layoutState: LayoutStateRecord;
  currentUserState: CurrentUserRecord;
  routing: RouteProps;
  articleSearchState: ArticleSearchStateRecord;
  bookmark: BookmarkRecord;
}
