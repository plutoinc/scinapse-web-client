import { TypedRecord, recordify } from "typed-immutable-record";
import { List } from "immutable";
import { PaperList, PaperRecord, Paper, PaperFactory, PaperListFactory } from "../../model/paper";

export enum SEARCH_SORTING {
  RELEVANCE,
  LATEST,
}

export interface SearchItemMeta {
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

export interface SearchItemMetaRecord extends TypedRecord<SearchItemMetaRecord>, SearchItemMeta {}

export const initialSearchItemMeta: SearchItemMeta = {
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

export interface SearchItemMetaList extends List<SearchItemMetaRecord> {}

export function makeSearchItemMetaListFromPaperList(paperList: PaperList): SearchItemMetaList {
  const searchitemMetaArray = paperList
    .map(_paper => {
      return initialSearchItemMeta;
    })
    .toJS();
  return SearchItemMetaFactory(searchitemMetaArray);
}

export function SearchItemMetaFactory(searchItemMetaArray: SearchItemMeta[] = []): SearchItemMetaList {
  if (searchItemMetaArray) {
    const recordifiedSearchItemMetaArray: SearchItemMetaRecord[] = searchItemMetaArray.map(searchItemMeta => {
      return recordify(searchItemMeta || initialSearchItemMeta);
    });

    return List(recordifiedSearchItemMetaArray);
  } else {
    const baseArray: SearchItemMetaRecord[] = [recordify(initialSearchItemMeta)];
    return List(baseArray);
  }
}

interface BaseArticleSearchState {
  isLoading: boolean;
  hasError: boolean;
  searchInput: string;
  page: number;
  totalElements: number;
  totalPages: number;
  isEnd: boolean;
  sorting: SEARCH_SORTING;
}

export interface ArticleSearchState extends BaseArticleSearchState {
  searchItemsToShow: Paper[];
  searchItemsMeta: SearchItemMeta[];
  targetPaper: Paper;
}

export interface InnerRecordifiedArticleSearchState extends BaseArticleSearchState {
  searchItemsToShow: PaperList;
  searchItemsMeta: SearchItemMetaList;
  targetPaper: PaperRecord;
}

export interface ArticleSearchStateRecord
  extends TypedRecord<ArticleSearchStateRecord>,
    InnerRecordifiedArticleSearchState {}

export const initialArticleSearchState: ArticleSearchState = {
  isLoading: false,
  hasError: false,
  searchInput: "",
  searchItemsToShow: [],
  searchItemsMeta: [],
  targetPaper: undefined,
  page: 0,
  totalElements: 0,
  totalPages: 0,
  isEnd: false,
  sorting: SEARCH_SORTING.RELEVANCE,
};

export const ArticleSearchStateFactory = (
  params: ArticleSearchState = initialArticleSearchState,
): ArticleSearchStateRecord => {
  const innerRecordifiedArticleSearchState: InnerRecordifiedArticleSearchState = {
    isLoading: params.isLoading,
    hasError: params.hasError,
    searchInput: params.searchInput,
    page: params.page,
    totalElements: params.totalElements,
    totalPages: params.totalPages,
    isEnd: params.isEnd,
    sorting: params.sorting,
    searchItemsToShow: PaperListFactory(params.searchItemsToShow),
    searchItemsMeta: SearchItemMetaFactory(params.searchItemsMeta),
    targetPaper: PaperFactory(params.targetPaper),
  };

  return recordify(innerRecordifiedArticleSearchState);
};

export const ARTICLE_SEARCH_INITIAL_STATE = ArticleSearchStateFactory();
