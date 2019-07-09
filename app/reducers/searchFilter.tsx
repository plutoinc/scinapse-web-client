import { AggregationData } from '../model/aggregation';
import { ACTION_TYPES, SearchActions } from '../actions/actionTypes';

export const SEARCH_FILTER_INITIAL_STATE: AggregationData = {
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

    default:
      return state;
  }
}
