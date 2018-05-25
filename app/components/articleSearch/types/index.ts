import { Dispatch } from "react-redux";
import { RouteProps, RouteComponentProps } from "react-router-dom";
import { ArticleSearchStateRecord } from "../records";
import { PaperList } from "../../../model/paper";
import { CurrentUserRecord } from "../../../model/currentUser";
import { LayoutStateRecord } from "../../layouts/records";
import { ConfigurationRecord } from "../../../reducers/configuration";

export interface ArticleSearchContainerProps extends RouteComponentProps<any> {
  articleSearchState: ArticleSearchStateRecord;
  layout: LayoutStateRecord;
  search: PaperList;
  routing: RouteProps;
  configuration: ConfigurationRecord;
  currentUserState: CurrentUserRecord;
  dispatch: Dispatch<any>;
}

export interface ArticleSearchSearchParams {
  query?: string;
  filter?: string;
  page?: string;
  sort?: string;
}
