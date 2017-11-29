import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_SEARCH_INITIAL_STATE, IArticleSearchStateRecord } from "./records";

export function reducer(state = ARTICLE_SEARCH_INITIAL_STATE, action: IReduxAction<any>): IArticleSearchStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: {
      return state.set("searchInput", action.payload.searchInput);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_SORTING_POPOVER: {
      return state.set("isSortingPopOverOpen", !state.get("isSortingPopOverOpen"));
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING: {
      return state.withMutations(currentState => {
        return currentState.set("sorting", action.payload.sorting).set("isSortingPopOverOpen", false);
      });
    }

    default:
      return state;
  }
}
