import { ACTION_TYPES } from "../../../actions/actionTypes";
import { MY_PAGE_CATEGORY_TYPE } from "./records";

export function changeCategory(category: MY_PAGE_CATEGORY_TYPE) {
  return {
    type: ACTION_TYPES.MY_PAGE_CHANGE_CATEGORY,
    payload: {
      category,
    },
  };
}
