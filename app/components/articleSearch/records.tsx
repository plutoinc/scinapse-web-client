import { Paper } from "../../model/paper";
import { AggregationData, AggregationJournal, AggregationFos } from "../../model/aggregation";
import { MatchAuthor } from "../../api/search";
import { Filter } from "../../api/member";

export interface ArticleSearchState
  extends Readonly<{
      lastSucceededParams: string;
      sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
      isContentLoading: boolean;
      isFilterLoading: boolean;
      isFilterSaveBoxLoading: boolean;
      pageErrorCode: number | null;
      searchInput: string;
      page: number;
      totalElements: number;
      totalPages: number;
      isEnd: boolean;
      yearFilterFromValue: number;
      yearFilterToValue: number;
      isJournalFilterExpanding: boolean;
      suggestionKeyword: string;
      fosFilter: number[];
      journalFilter: number[];
      fosFilterObject: AggregationFos[];
      journalFilterObject: AggregationJournal[];
      highlightedSuggestionKeyword: string;
      searchItemsToShow: Paper[];
      matchAuthors: MatchAuthor | null;
      targetPaper: Paper | null;
      aggregationData: AggregationData | null;
      searchFromSuggestion: boolean;
      myFilters: Filter[];
      currentSavedFilter: Filter | null;
    }> {}

export const ARTICLE_SEARCH_INITIAL_STATE: ArticleSearchState = {
  lastSucceededParams: "{}",
  sort: "RELEVANCE",
  isContentLoading: false,
  isFilterLoading: false,
  isFilterSaveBoxLoading: false,
  pageErrorCode: null,
  aggregationData: null,
  searchInput: "",
  searchItemsToShow: [],
  targetPaper: null,
  page: 1,
  totalElements: 0,
  totalPages: 0,
  isEnd: false,
  yearFilterFromValue: 0,
  yearFilterToValue: 0,
  isJournalFilterExpanding: false,
  fosFilter: [],
  matchAuthors: null,
  journalFilter: [],
  fosFilterObject: [],
  journalFilterObject: [],
  suggestionKeyword: "",
  highlightedSuggestionKeyword: "",
  searchFromSuggestion: false,
  myFilters: [],
  currentSavedFilter: null,
};
