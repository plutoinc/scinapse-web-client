import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from "./records";
import { SearchResult } from "../../api/search";
import {
  ChangeRangeInputParams,
  FILTER_TYPE_HAS_RANGE,
  FILTER_RANGE_TYPE,
  FILTER_BOX_TYPE,
  FILTER_TYPE_HAS_EXPANDING_OPTION,
} from "../../constants/paperSearch";

export function reducer(
  state: ArticleSearchState = ARTICLE_SEARCH_INITIAL_STATE,
  action: ReduxAction<any>
): ArticleSearchState {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: {
      return { ...state, searchInput: action.payload.searchInput };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS: {
      const filters = action.payload.filters;

      return {
        ...state,
        isLoading: true,
        pageErrorCode: null,
        searchFromSuggestion: false,
        searchInput: action.payload.query,
        sort: action.payload.sort,
        yearFilterFromValue: filters.yearFrom || 0,
        yearFilterToValue: filters.yearTo || 0,
        IFFilterFromValue: filters.journalIFFrom || 0,
        IFFilterToValue: filters.journalIFTo || 0,
        fosFilter: filters.fos || [],
        journalFilter: filters.journal || [],
        suggestionKeyword: "",
        highlightedSuggestionKeyword: "",
        aggregationData: null,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      const payload: SearchResult = action.payload;

      if (payload.data.page) {
        return {
          ...state,
          isLoading: false,
          pageErrorCode: null,
          isEnd: payload.data.page.last,
          page: payload.data.page.page,
          totalElements: payload.data.page.totalElements,
          totalPages: payload.data.page.totalPages,
          searchItemsToShow: payload.data.content,
          suggestionKeyword: payload.data.suggestion ? payload.data.suggestion.suggestion : "",
          highlightedSuggestionKeyword: payload.data.suggestion ? payload.data.suggestion.highlighted : "",
          searchFromSuggestion: payload.data.resultModified,
          aggregationData: payload.data.aggregation,
          matchEntities: payload.data.matchedEntities,
        };
      }

      return state;
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: {
      return {
        ...state,
        isLoading: false,
        pageErrorCode: action.payload.statusCode,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        isLoading: true,
        pageErrorCode: null,
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
        pageErrorCode: null,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        isLoading: false,
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

    default: {
      return state;
    }
  }
}
