import { Dispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { LayoutStateRecord } from "../records";
import { CurrentUser } from "../../../model/currentUser";
import { ArticleSearchState } from "../../articleSearch/records";
import { Bookmark } from "../../../model/bookmark";

export interface HeaderProps {
  layoutState: LayoutStateRecord;
  currentUserState: CurrentUser;
  routing: RouteProps;
  articleSearchState: ArticleSearchState;
  bookmark: Bookmark;
  dispatch: Dispatch<any>;
}
