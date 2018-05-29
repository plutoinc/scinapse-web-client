import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from "./records";
import {
  FILTER_RANGE_TYPE,
  FILTER_BOX_TYPE,
  ChangeRangeInputParams,
  FILTER_TYPE_HAS_RANGE,
  FILTER_TYPE_HAS_EXPANDING_OPTION,
} from "./actions";
import { AvailableCitationType } from "../paperShow/records";
import { SuggestionKeywordRecord } from "../../model/suggestion";

export function reducer(
  state: ArticleSearchState = ARTICLE_SEARCH_INITIAL_STATE,
  action: ReduxAction<any>,
): ArticleSearchState {
  switch (action.type) {
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
      return { ...state, isLoadingAggregateData: false, hasErrorOnFetchingAggregateData: true };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: {
      return { ...state, searchInput: action.payload.searchInput };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS: {
      return { ...state, isLoading: true, hasError: false };
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
          return { ...state, isJournalIFFilterOpen: !state.isJournalIFFilterOpen };
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
          return { ...state, isFOSFilterExpanding: !state.isFOSFilterExpanding };
        case FILTER_TYPE_HAS_EXPANDING_OPTION.JOURNAL:
          return { ...state, isJournalFilterExpanding: !state.isJournalFilterExpanding };
        default:
          return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CLICK_CITATION_TAB: {
      const payload: { tab: AvailableCitationType } = action.payload;

      return { ...state, activeCitationTab: payload.tab };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT: {
      return { ...state, citationText: "", isFetchingCitationInformation: true };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT: {
      const payload: { citationText: string } = action.payload;
      return { ...state, citationText: payload.citationText, isFetchingCitationInformation: false };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG: {
      return { ...state, isCitationDialogOpen: !state.isCitationDialogOpen };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SET_ACTIVE_CITATION_DIALOG_PAPER_ID: {
      return { ...state, activeCitationDialogPaperId: action.payload.paperId };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_SUGGESTION_KEYWORD: {
      const keyword: SuggestionKeywordRecord = action.payload.keyword;
      return { ...state, suggestionKeyword: keyword.suggestion, highlightedSuggestionKeyword: keyword.highlighted };
    }

    default: {
      return state;
    }
  }
}
