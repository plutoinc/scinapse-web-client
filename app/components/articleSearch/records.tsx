import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";
import { List } from "immutable";
import { IPapersRecord } from "../../model/paper";

export enum SEARCH_SORTING {
  RELEVANCE,
  LATEST,
}

export interface ISearchItemInfo {
  isLoading: Boolean;
  hasError: Boolean;
  commentInput: string;
  isAbstractOpen: Boolean;
  isCommentsOpen: Boolean;
}

export interface ISearchItemInfoRecord extends TypedRecord<ISearchItemInfoRecord>, ISearchItemInfo {}

const initialSearchItemInfo: ISearchItemInfoRecord = recordify({
  isLoading: false,
  hasError: false,
  commentInput: "",
  isAbstractOpen: false,
  isCommentsOpen: false,
});

export interface ISearchItemsInfo extends List<ISearchItemInfoRecord> {}

export function initializeSearchItemsInfo(size: number): ISearchItemsInfo {
  let searchItemInfoArray = [];

  for (let i = 0; i < size; i++) {
    searchItemInfoArray.push(initialSearchItemInfo);
  }

  return List(searchItemInfoArray);
}

export interface IArticleSearchState {
  isLoading: boolean;
  hasError: boolean;
  searchInput: string;
  searchItemsToShow: IPapersRecord;
  searchItemsInfo: ISearchItemsInfo;
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
  searchItemsInfo: List(),
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
