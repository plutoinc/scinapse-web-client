import { Paper } from '../../model/paper';
import { MatchAuthor, MatchEntityAuthor } from '../../api/search';

export interface ArticleSearchState
  extends Readonly<{
      lastSucceededParams: string;
      sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
      isContentLoading: boolean;
      pageErrorCode: number | null;
      searchInput: string;
      page: number;
      totalElements: number;
      totalPages: number;
      isEnd: boolean;
      doi: string | null;
      doiPatternMatched: boolean;
      suggestionKeyword: string;
      highlightedSuggestionKeyword: string;
      searchItemsToShow: Paper[];
      matchAuthors: MatchAuthor | null;
      targetPaper: Paper | null;
      searchFromSuggestion: boolean;
      topRefAuthors: MatchEntityAuthor[] | null;
      detectedYear: number | null;
    }> {}

export const ARTICLE_SEARCH_INITIAL_STATE: ArticleSearchState = {
  lastSucceededParams: '{}',
  sort: 'RELEVANCE',
  isContentLoading: true,
  pageErrorCode: null,
  searchInput: '',
  searchItemsToShow: [],
  targetPaper: null,
  page: 1,
  totalElements: 0,
  totalPages: 0,
  isEnd: false,
  doi: null,
  doiPatternMatched: false,
  matchAuthors: null,
  suggestionKeyword: '',
  highlightedSuggestionKeyword: '',
  searchFromSuggestion: false,
  topRefAuthors: null,
  detectedYear: null,
};
