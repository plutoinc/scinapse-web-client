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
      yearFilterFromValue: number;
      yearFilterToValue: number;
      IFFilterFromValue: number;
      IFFilterToValue: number;
      isJournalFilterExpanding: boolean;
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
  yearFilterFromValue: 0,
  yearFilterToValue: 0,
  IFFilterFromValue: 0,
  IFFilterToValue: 0,
  isJournalFilterExpanding: false,
  fosFilter: [],
  matchAuthors: null,
  journalFilter: [],
  suggestionKeyword: "",
  highlightedSuggestionKeyword: "",
  searchFromSuggestion: false,
};
