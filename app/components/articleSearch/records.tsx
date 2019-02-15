import { Paper } from "../../model/paper";
import { AggregationData } from "../../model/aggregation";
import { MatchAuthor } from "../../api/search";

export interface ArticleSearchState
  extends Readonly<{
      lastSucceededParams: string;
      sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
      isLoading: boolean;
      pageErrorCode: number | null;
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
      matchAuthors: MatchAuthor | null;
      targetPaper: Paper | null;
      aggregationData: AggregationData | null;
      searchFromSuggestion: boolean;
    }> {}

export const ARTICLE_SEARCH_INITIAL_STATE: ArticleSearchState = {
  lastSucceededParams: "{}",
  sort: "RELEVANCE",
  isLoading: false,
  pageErrorCode: null,
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
  matchAuthors: null,
  journalFilter: [],
  suggestionKeyword: "",
  highlightedSuggestionKeyword: "",
  searchFromSuggestion: false,
};
