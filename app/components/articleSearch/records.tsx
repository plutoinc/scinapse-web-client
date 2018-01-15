import { TypedRecord, makeTypedFactory, recordify } from "typed-immutable-record";
import { List } from "immutable";
import { IPapersRecord, IPaperRecord } from "../../model/paper";

export enum SEARCH_SORTING {
  RELEVANCE,
  LATEST,
}

export interface ISearchItemMeta {
  isLoading: boolean;
  hasError: boolean;
  commentInput: string;
  isAbstractOpen: boolean;
  isCommentsOpen: boolean;
  isAuthorsOpen: boolean;
  isFirstOpen: boolean;
  isTitleVisited: boolean;
  page: number;
  totalPages: number;
  isPageLoading: boolean;
}

export interface ISearchItemMetaRecord extends TypedRecord<ISearchItemMetaRecord>, ISearchItemMeta {}

export const initialSearcItemMeta: ISearchItemMeta = {
  isLoading: false,
  hasError: false,
  commentInput: "",
  isAbstractOpen: false,
  isCommentsOpen: false,
  isAuthorsOpen: false,
  isFirstOpen: true,
  isTitleVisited: false,
  page: 0,
  totalPages: 0,
  isPageLoading: false,
};

export interface ISearchItemsMeta extends List<ISearchItemMetaRecord> {}

export function initializeSearchItemsMeta(size: number): ISearchItemsMeta {
  let searchItemMetaArray = [];

  for (let i = 0; i < size; i++) {
    searchItemMetaArray.push(recordify(initialSearcItemMeta));
  }

  return List(searchItemMetaArray);
}

export interface IArticleSearchState {
  isLoading: boolean;
  hasError: boolean;
  searchInput: string;
  searchItemsToShow: IPapersRecord;
  searchItemsMeta: ISearchItemsMeta;
  targetPaper: IPaperRecord;
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
  searchItemsMeta: List(),
  targetPaper: null,
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
