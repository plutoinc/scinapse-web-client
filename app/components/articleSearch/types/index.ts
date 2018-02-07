import { DispatchProp } from "react-redux";
import { RouteProps } from "react-router-dom";
import { IArticleSearchStateRecord } from "../records";
import { IPapersRecord } from "../../../model/paper";
import { ICurrentUserRecord } from "../../../model/currentUser";

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
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
  currentUserState: ICurrentUserRecord;
}

export interface IArticleSearchContainerMappedState {
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
  currentUserState: ICurrentUserRecord;
}

export interface IArticleSearchSearchParams {
  query?: string;
  filter?: string;
  page?: string;
  cognitiveId?: string;
  references?: string;
  cited?: string;
}
