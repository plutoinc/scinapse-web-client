import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { List } from "immutable";
import { IPapersRecord } from "../../model/paper";

export enum SEARCH_SORTING {
  RELEVANCE,
  LATEST,
}

export interface IArticleSearchState {
  isLoading: boolean;
  hasError: boolean;
  searchInput: string;
  searchItemsToShow: IPapersRecord;
  page: number;
  totalElements: number;
  totalPages: number;
  isEnd: boolean;
  sorting: SEARCH_SORTING;
}

export interface IArticleSearchStateRecord extends TypedRecord<IArticleSearchStateRecord>, IArticleSearchState {}

const initialArticleSearchState: IArticleSearchState = {
  isLoading: false,
  hasError: false,
  searchInput: "",
  searchItemsToShow: List(),
  page: 0,
  totalElements: 0,
  totalPages: 0,
  isEnd: false,
  sorting: SEARCH_SORTING.RELEVANCE,
};

export const ArticleSearchStateFactory = makeTypedFactory<IArticleSearchState, IArticleSearchStateRecord>(
  initialArticleSearchState,
);

export const ARTICLE_SEARCH_INITIAL_STATE = ArticleSearchStateFactory();
