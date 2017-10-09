import { IReduxAction } from "../../typings/actionType";
import { IArticleFeedStateRecord, ARTICLE_FEED_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = ARTICLE_FEED_INITIAL_STATE, action: IReduxAction<any>): IArticleFeedStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_FEED_CHANGE_CATEGORY: {
      return state.withMutations(currentState => {
        return currentState.set("category", action.payload.category).set("isCategoryPopOverOpen", false);
      });
    }

    case ACTION_TYPES.ARTICLE_FEED_CHANGE_SORTING_OPTION: {
      return state.set("sortingOption", action.payload.sortingOption);
    }

    case ACTION_TYPES.ARTICLE_FEED_OPEN_CATEGORY_POPOVER: {
      return state.withMutations(currentState => {
        return currentState
          .set("categoryPopoverAnchorElement", action.payload.element)
          .set("isCategoryPopOverOpen", true);
      });
    }

    case ACTION_TYPES.ARTICLE_FEED_CLOSE_CATEGORY_POPOVER: {
      return state.set("isCategoryPopOverOpen", false);
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return ARTICLE_FEED_INITIAL_STATE;
    }

    default:
      return state;
  }
}
