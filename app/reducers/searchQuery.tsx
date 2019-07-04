import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface SearchQueryState {
  query: string;
}

export const SEARCH_QUERY_INITIAL_STATE: SearchQueryState = {
  query: '',
};

export function reducer(state = SEARCH_QUERY_INITIAL_STATE, action: Actions): SearchQueryState {
  switch (action.type) {
    case ACTION_TYPES.SEARCH_QUERY_CHANGE_QUERY: {
      return { ...state, query: action.payload.query };
    }

    case ACTION_TYPES.SEARCH_QUERY_RESET_QUERY: {
      return { ...state, query: '' };
    }

    default:
      return state;
  }
}
