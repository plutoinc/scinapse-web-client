import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from "./records";
import {
  FILTER_RANGE_TYPE,
  FILTER_BOX_TYPE,
  ChangeRangeInputParams,
  FILTER_TYPE_HAS_RANGE,
  FILTER_TYPE_HAS_EXPANDING_OPTION,
} from "./actions";
import { SuggestionKeyword } from "../../model/suggestion";

export function reducer(
  state: ArticleSearchState = ARTICLE_SEARCH_INITIAL_STATE,
  action: ReduxAction<any>
): ArticleSearchState {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_SAVE_LAST_SUCCEEDED_PARAMS: {
      return {
        ...state,
        lastSucceededParams: action.payload.params,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_AGGREGATION_DATA: {
      return {
        ...state,
        isLoadingAggregateData: true,
        hasErrorOnFetchingAggregateData: false,
        aggregationData: null,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_AGGREGATION_DATA: {
      return {
        ...state,
        isFilterAvailable: action.payload.available,
        isLoadingAggregateData: false,
        hasErrorOnFetchingAggregateData: false,
        aggregationData: action.payload.aggregationData,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AGGREGATION_DATA: {
      return {
        ...state,
        isLoadingAggregateData: false,
        hasErrorOnFetchingAggregateData: true,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: {
      return { ...state, searchInput: action.payload.searchInput };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS: {
      const filters = action.payload.filters;

      return {
        ...state,
        isLoading: true,
        hasError: false,
        searchInput: action.payload.query,
        sort: action.payload.sort,
        yearFilterFromValue: filters.yearFrom || 0,
        yearFilterToValue: filters.yearTo || 0,
        IFFilterFromValue: filters.journalIFFrom || 0,
        IFFilterToValue: filters.journalIFTo || 0,
        fosFilter: filters.fos || [],
        journalFilter: filters.journal || [],
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      return {
        ...state,
        isEnd: action.payload.isEnd,
        page: action.payload.nextPage,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        isLoading: false,
        hasError: false,
        searchItemsToShow: action.payload.papers,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: {
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        isEnd: action.payload.isEnd,
        page: action.payload.nextPage,
        searchItemsToShow: action.payload.papers,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        isLoading: false,
        hasError: false,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT: {
      const payload: ChangeRangeInputParams = action.payload;

      if (payload.type === FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR) {
        if (payload.rangeType === FILTER_RANGE_TYPE.FROM && payload.numberValue) {
          return { ...state, yearFilterFromValue: payload.numberValue };
        } else if (payload.rangeType === FILTER_RANGE_TYPE.TO && payload.numberValue) {
          return { ...state, yearFilterToValue: payload.numberValue };
        } else {
          return state;
        }
      } else if (payload.type === FILTER_TYPE_HAS_RANGE.JOURNAL_IF) {
        if (payload.rangeType === FILTER_RANGE_TYPE.FROM && payload.numberValue) {
          return { ...state, IFFilterFromValue: payload.numberValue };
        } else if (payload.rangeType === FILTER_RANGE_TYPE.TO && payload.numberValue) {
          return { ...state, IFFilterToValue: payload.numberValue };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX: {
      const type: FILTER_BOX_TYPE = action.payload.type;

      switch (type) {
        case FILTER_BOX_TYPE.PUBLISHED_YEAR:
          return { ...state, isYearFilterOpen: !state.isYearFilterOpen };
        case FILTER_BOX_TYPE.JOURNAL_IF:
          return {
            ...state,
            isJournalIFFilterOpen: !state.isJournalIFFilterOpen,
          };
        case FILTER_BOX_TYPE.FOS:
          return { ...state, isFOSFilterOpen: !state.isFOSFilterOpen };
        case FILTER_BOX_TYPE.JOURNAL:
          return { ...state, isJournalFilterOpen: !state.isJournalFilterOpen };
        default:
          return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX: {
      const type: FILTER_TYPE_HAS_EXPANDING_OPTION = action.payload.type;

      switch (type) {
        case FILTER_TYPE_HAS_EXPANDING_OPTION.FOS:
          return {
            ...state,
            isFOSFilterExpanding: !state.isFOSFilterExpanding,
          };
        case FILTER_TYPE_HAS_EXPANDING_OPTION.JOURNAL:
          return {
            ...state,
            isJournalFilterExpanding: !state.isJournalFilterExpanding,
          };
        default:
          return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_SUGGESTION_KEYWORD: {
      const keyword: SuggestionKeyword = action.payload.keyword;
      if (keyword) {
        return {
          ...state,
          suggestionKeyword: keyword.suggestion,
          highlightedSuggestionKeyword: keyword.highlighted,
        };
      } else {
        return state;
      }
    }

    default: {
      return state;
    }
  }
}
