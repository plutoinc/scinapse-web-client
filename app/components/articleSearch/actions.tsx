import { ACTION_TYPES } from "../../actions/actionTypes";

export function changeSearchInput(searchInput: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
    payload: {
      searchInput
    }
  };
}
