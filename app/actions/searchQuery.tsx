import { ACTION_TYPES } from './actionTypes';

export function changeSearchQuery(query: string) {
  return {
    type: ACTION_TYPES.SEARCH_QUERY_CHANGE_QUERY,
    payload: { query },
  };
}
