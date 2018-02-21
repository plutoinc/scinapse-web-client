import { DispatchProp } from "react-redux";
import { RouteProps } from "react-router-dom";
import { ArticleSearchStateRecord } from "../records";
import { PaperList } from "../../../model/paper";
import { CurrentUserRecord } from "../../../model/currentUser";
import { LayoutStateRecord } from "../../layouts/records";

export enum SEARCH_FETCH_ITEM_MODE {
  QUERY,
  REFERENCES,
  CITED,
}

export enum SEARCH_FILTER_MODE {
  PUBLICATION_YEAR,
  JOURNAL_IF,
}

export interface IArticleSearchContainerProps extends DispatchProp<IArticleSearchContainerMappedState> {
  articleSearchState: ArticleSearchStateRecord;
  layout: LayoutStateRecord;
  search: PaperList;
  routing: RouteProps;
  currentUserState: CurrentUserRecord;
}

export interface IArticleSearchContainerMappedState {
  articleSearchState: ArticleSearchStateRecord;
  layout: LayoutStateRecord;
  search: PaperList;
  routing: RouteProps;
  currentUserState: CurrentUserRecord;
}

export interface IArticleSearchSearchParams {
  query?: string;
  filter?: string;
  page?: string;
  cognitiveId?: string;
  references?: string;
  cited?: string;
}
