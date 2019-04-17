import { Dispatch } from "react-redux";
import { LayoutState } from "../records";
import { CurrentUser } from "../../../model/currentUser";
import { ArticleSearchState } from "../../articleSearch/records";
import { RouteComponentProps } from "react-router";
import { AuthorSearchState } from "../../../containers/authorSearch/records";
import { Collection } from "../../../model/collection";
import { CollectionsState } from "../../../reducers/collections";

export interface HeaderProps extends RouteComponentProps<any> {
  layoutState: LayoutState;
  currentUserState: CurrentUser;
  articleSearchState: ArticleSearchState;
  authorSearchState: AuthorSearchState;
  collectionsState: CollectionsState;
  userCollections: Collection[];
  dispatch: Dispatch<any>;
}
