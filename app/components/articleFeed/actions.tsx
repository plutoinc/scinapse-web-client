import { ACTION_TYPES } from "../../actions/actionTypes";
import { FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "./records";

export function changeCategory(category: FEED_CATEGORIES) {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_CHANGE_CATEGORY,
    payload: {
      category,
    },
  };
}

export function changeSortingOption(sortingOption: FEED_SORTING_OPTIONS) {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_CHANGE_SORTING_OPTION,
    payload: {
      sortingOption,
    },
  };
}

export function openCategoryPopover(element: React.ReactInstance) {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_OPEN_CATEGORY_POPOVER,
    payload: {
      element,
    },
  };
}

export function closeCategoryPopover() {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_CLOSE_CATEGORY_POPOVER,
  };
}
