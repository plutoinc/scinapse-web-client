import { ACTION_TYPES } from "../../actions/actionTypes";
import { push } from "react-router-redux";

export function changeSearchInput(searchInput: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
    payload: {
      searchInput,
    },
  };
}

export function handleSearchPush(searchInput: string) {
  return push(`/search?query=${searchInput}&page=1`);
}
