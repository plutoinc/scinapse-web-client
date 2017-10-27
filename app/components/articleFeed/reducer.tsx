import { List } from "immutable";
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
      return state.withMutations(currentState => {
        return currentState
          .set("isEnd", false)
          .set("page", 0)
          .set("feedItemsToShow", List())
          .set("sortingOption", action.payload.sortingOption);
      });
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

    case ACTION_TYPES.ARTICLE_FEED_START_TO_GET_ARTICLES: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_FEED_SUCCEEDED_TO_GET_ARTICLES: {
      return state.withMutations(currentState => {
        return currentState
          .set("isEnd", action.payload.isEnd)
          .set("page", action.payload.nextPage)
          .set("feedItemsToShow", currentState.feedItemsToShow.concat(action.payload.articles))
          .set("isLoading", false)
          .set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_FEED_FAILED_TO_GET_ARTICLES: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoading", false)
          .set("hasError", false)
          .set("isEnd", false);
      });
    }

    default:
      return state;
  }
}
