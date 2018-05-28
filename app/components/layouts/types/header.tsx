import { Dispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { LayoutStateRecord } from "../records";
import { CurrentUserRecord } from "../../../model/currentUser";
import { ArticleSearchStateRecord } from "../../articleSearch/records";
import { BookmarkRecord } from "../../../model/bookmark";

export interface HeaderProps {
  layoutState: LayoutStateRecord;
  currentUserState: CurrentUserRecord;
  routing: RouteProps;
  articleSearchState: ArticleSearchStateRecord;
  bookmark: BookmarkRecord;
  dispatch: Dispatch<any>;
}
