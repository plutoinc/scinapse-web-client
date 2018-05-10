import { TypedRecord, recordify } from "typed-immutable-record";
import { List } from "immutable";
import { PaperList, PaperRecord, Paper, PaperFactory, PaperListFactory } from "../../model/paper";
import { AggregationData, AggregationDataRecord, AggregationFactory } from "../../model/aggregation";
import { AvailableCitationType } from "../paperShow/records";

export type SEARCH_SORT_OPTIONS = "RELEVANCE" | "MOST_CITATIONS" | "OLDEST_FIRST" | "NEWEST_FIRST";

export interface SearchItemMeta {
  paperId: number | null;
  isLoading: boolean;
  hasError: boolean;
  isCommentsOpen: boolean;
  isAuthorsOpen: boolean;
  isTitleVisited: boolean;
  page: number;
  totalPages: number;
  isPageLoading: boolean;
  isBookmarked: boolean;
}

export interface SearchItemMetaRecord extends TypedRecord<SearchItemMetaRecord>, SearchItemMeta {}

export const initialSearchItemMeta: SearchItemMeta = {
  paperId: null,
  isLoading: false,
  hasError: false,
  isCommentsOpen: false,
  isAuthorsOpen: false,
  isTitleVisited: false,
  page: 1,
  totalPages: 0,
  isPageLoading: false,
  isBookmarked: false,
};

export interface SearchItemMetaList extends List<SearchItemMetaRecord> {}

export function makeSearchItemMetaListFromPaperList(paperList: PaperList): SearchItemMetaList {
  const searchItemMetaArray = paperList
    .map(paper => {
      return { ...initialSearchItemMeta, ...{ paperId: paper.id } };
    })
    .toArray(); // TODO: Change this method
  return SearchItemMetaFactory(searchItemMetaArray);
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
  isLoadingAggregateData: boolean;
  hasErrorOnFetchingAggregateData: boolean;
  searchInput: string;
  page: number;
  totalElements: number;
  totalPages: number;
  isEnd: boolean;
  isFilterAvailable: boolean;
  isYearFilterOpen: boolean;
  isJournalIFFilterOpen: boolean;
  isFOSFilterOpen: boolean;
  isJournalFilterOpen: boolean;
  isFOSFilterExpanding: boolean;
  isJournalFilterExpanding: boolean;
  yearFilterFromValue: number;
  yearFilterToValue: number;
  IFFilterFromValue: number;
  IFFilterToValue: number;
  isCitationDialogOpen: boolean;
  activeCitationTab: AvailableCitationType;
  isFetchingCitationInformation: boolean;
  citationText: string;
  activeCitationDialogPaperId: number | null;
  suggestionKeyword: string;
  highlightedSuggestionKeyword: string;
}

export interface ArticleSearchState extends BaseArticleSearchState {
  searchItemsToShow: Paper[];
  searchItemsMeta: SearchItemMeta[];
  targetPaper: Paper;
  aggregationData: AggregationData | null;
}

export interface InnerRecordifiedArticleSearchState extends BaseArticleSearchState {
  searchItemsToShow: PaperList;
  searchItemsMeta: SearchItemMetaList;
  targetPaper: PaperRecord;
  aggregationData: AggregationDataRecord | null;
}

export interface ArticleSearchStateRecord
  extends TypedRecord<ArticleSearchStateRecord>,
    InnerRecordifiedArticleSearchState {}

export const initialArticleSearchState: ArticleSearchState = {
  isLoading: false,
  hasError: false,
  isLoadingAggregateData: false,
  hasErrorOnFetchingAggregateData: false,
  aggregationData: null,
  searchInput: "",
  searchItemsToShow: [],
  searchItemsMeta: [],
  targetPaper: undefined,
  page: 0,
  totalElements: 0,
  totalPages: 0,
  isEnd: false,
  isFilterAvailable: false,
  isYearFilterOpen: true,
  isJournalIFFilterOpen: true,
  isFOSFilterOpen: true,
  isJournalFilterOpen: true,
  isFOSFilterExpanding: false,
  isJournalFilterExpanding: false,
  yearFilterFromValue: 0,
  yearFilterToValue: 0,
  IFFilterFromValue: 0,
  IFFilterToValue: 0,
  isCitationDialogOpen: false,
  activeCitationTab: AvailableCitationType.BIBTEX,
  isFetchingCitationInformation: false,
  citationText: "",
  activeCitationDialogPaperId: null,
  suggestionKeyword: "",
  highlightedSuggestionKeyword: "",
};

export const ArticleSearchStateFactory = (
  params: ArticleSearchState = initialArticleSearchState,
): ArticleSearchStateRecord => {
  const innerRecordifiedArticleSearchState: InnerRecordifiedArticleSearchState = {
    isLoading: params.isLoading,
    hasError: params.hasError,
    isLoadingAggregateData: params.isLoadingAggregateData,
    hasErrorOnFetchingAggregateData: params.hasErrorOnFetchingAggregateData,
    aggregationData: AggregationFactory(params.aggregationData),
    searchInput: params.searchInput,
    page: params.page,
    totalElements: params.totalElements,
    totalPages: params.totalPages,
    isEnd: params.isEnd,
    searchItemsToShow: PaperListFactory(params.searchItemsToShow),
    searchItemsMeta: SearchItemMetaFactory(params.searchItemsMeta),
    targetPaper: PaperFactory(params.targetPaper),
    isFilterAvailable: params.isFilterAvailable,
    isYearFilterOpen: params.isYearFilterOpen,
    isJournalIFFilterOpen: params.isJournalIFFilterOpen,
    isFOSFilterOpen: params.isFOSFilterOpen,
    isJournalFilterOpen: params.isJournalFilterOpen,
    isFOSFilterExpanding: params.isFOSFilterExpanding,
    isJournalFilterExpanding: params.isJournalFilterExpanding,
    yearFilterFromValue: params.yearFilterFromValue,
    yearFilterToValue: params.yearFilterToValue,
    IFFilterFromValue: params.IFFilterFromValue,
    IFFilterToValue: params.IFFilterToValue,
    isCitationDialogOpen: params.isCitationDialogOpen,
    activeCitationTab: params.activeCitationTab,
    isFetchingCitationInformation: params.isFetchingCitationInformation,
    citationText: params.citationText,
    activeCitationDialogPaperId: params.activeCitationDialogPaperId,
    suggestionKeyword: params.suggestionKeyword,
    highlightedSuggestionKeyword: params.highlightedSuggestionKeyword,
  };

  return recordify(innerRecordifiedArticleSearchState);
};

export const ARTICLE_SEARCH_INITIAL_STATE = ArticleSearchStateFactory();
