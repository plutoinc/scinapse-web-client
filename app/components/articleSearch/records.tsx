import { Paper } from "../../model/paper";
import { AggregationData } from "../../model/aggregation";

export type SEARCH_SORT_OPTIONS = "RELEVANCE" | "MOST_CITATIONS" | "OLDEST_FIRST" | "NEWEST_FIRST";

export interface ArticleSearchState
  extends Readonly<{
      lastSucceededParams: string;
      sort: SEARCH_SORT_OPTIONS;
      isLoading: boolean;
      hasError: boolean;
      searchInput: string;
      page: number;
      totalElements: number;
      totalPages: number;
      isEnd: boolean;
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
      suggestionKeyword: string;
      fosFilter: number[];
      journalFilter: number[];
      highlightedSuggestionKeyword: string;
      searchItemsToShow: Paper[];
      targetPaper: Paper | null;
      aggregationData: AggregationData | null;
      searchFromSuggestion: boolean;
    }> {}

export const ARTICLE_SEARCH_INITIAL_STATE: ArticleSearchState = {
  lastSucceededParams: "{}",
  sort: "RELEVANCE",
  isLoading: false,
  hasError: false,
  aggregationData: null,
  searchInput: "",
  searchItemsToShow: [],
  targetPaper: null,
  page: 1,
  totalElements: 0,
  totalPages: 0,
  isEnd: false,
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
  fosFilter: [],
  journalFilter: [],
  suggestionKeyword: "",
  highlightedSuggestionKeyword: "",
  searchFromSuggestion: false,
};
