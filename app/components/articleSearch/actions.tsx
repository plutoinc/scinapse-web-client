import { ACTION_TYPES } from "../../actions/actionTypes";
import { push } from "react-router-redux";
import { SEARCH_SORTING } from "./records";

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

export function toggleSortingPopover() {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_SORTING_POPOVER,
  };
}

export function changeSorting(sorting: SEARCH_SORTING) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
    payload: {
      sorting,
    },
  };
}
