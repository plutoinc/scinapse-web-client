import { Dispatch } from "react-redux";
import { RouteProps, RouteComponentProps } from "react-router-dom";
import { ArticleSearchState } from "../records";
import { PaperList } from "../../../model/paper";
import { CurrentUser } from "../../../model/currentUser";
import { LayoutState } from "../../layouts/records";
import { Configuration } from "../../../reducers/configuration";

export interface ArticleSearchContainerProps extends RouteComponentProps<any> {
  articleSearchState: ArticleSearchState;
  layout: LayoutState;
  search: PaperList;
  routing: RouteProps;
  configuration: Configuration;
  currentUserState: CurrentUser;
  dispatch: Dispatch<any>;
}

export interface ArticleSearchSearchParams {
  query?: string;
  filter?: string;
  page?: string;
  sort?: string;
}
