import { AggregationData } from '../model/aggregation';
import { ACTION_TYPES, SearchActions } from '../actions/actionTypes';
import { FILTER_BUTTON_TYPE } from '../components/filterButton';

export interface SearchFilterState extends AggregationData {
  activeButton: FILTER_BUTTON_TYPE | null;
  currentYearFrom: number;
  currentYearTo: number;
  selectedJournalIds: number[];
  selectedFOSIds: number[];
}

export const SEARCH_FILTER_INITIAL_STATE: SearchFilterState = {
  activeButton: null,
  currentYearFrom: 0,
  currentYearTo: 0,
  selectedJournalIds: [],
  selectedFOSIds: [],
  fosList: [],
  journals: [],
  yearAll: [],
  yearFiltered: [],
};

export function reducer(state = SEARCH_FILTER_INITIAL_STATE, action: SearchActions) {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      const { data } = action.payload;

      if (!data.aggregation) return state;

      return {
        ...state,
        ...data.aggregation,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SET_ACTIVE_FILTER_BOX_BUTTON: {
      return {
        ...state,
        activeButton: action.payload.button,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS: {
      const { filters } = action.payload;

      return {
        ...state,
        currentYearFrom: filters.yearFrom,
        currentYearTo: filters.yearTo,
        selectedJournalIds: filters.journal,
        selectedFOSIds: filters.fos,
      };
    }

    default:
      return state;
  }
}
