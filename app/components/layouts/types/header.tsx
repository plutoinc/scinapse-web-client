import { Dispatch } from "react-redux";
import { LayoutState } from "../records";
import { CurrentUser } from "../../../model/currentUser";
import { ArticleSearchState } from "../../articleSearch/records";
import { RouteComponentProps } from "react-router";
import { AuthorSearchState } from "../../../containers/authorSearch/records";
import { MyCollectionsState } from "../../../containers/paperShowCollectionControlButton/reducer";

export interface HeaderProps extends RouteComponentProps<any> {
  layoutState: LayoutState;
  currentUserState: CurrentUser;
  articleSearchState: ArticleSearchState;
  authorSearchState: AuthorSearchState;
  myCollectionsState: MyCollectionsState;
  dispatch: Dispatch<any>;
}
