import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_SEARCH_INITIAL_STATE, IArticleSearchStateRecord, initializeSearchItemsInfo } from "./records";

export function reducer(state = ARTICLE_SEARCH_INITIAL_STATE, action: IReduxAction<any>): IArticleSearchStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: {
      return state.set("searchInput", action.payload.searchInput);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING: {
      return state.set("sorting", action.payload.sorting);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isEnd", action.payload.isEnd)
          .set("page", action.payload.nextPage)
          .set("searchItemsToShow", action.payload.papers)
          .set("searchItemsInfo", initializeSearchItemsInfo(action.payload.numberOfElements))
          .set("totalElements", action.payload.totalElements)
          .set("totalPages", action.payload.totalPages)
          .set("isLoading", false)
          .set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT: {
      return state.setIn(["searchItemsInfo", action.payload.index, "commentInput"], action.payload.comment);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT: {
      const toggledValue = !state.getIn(["searchItemsInfo", action.payload.index, "isAbstractOpen"]);

      return state.setIn(["searchItemsInfo", action.payload.index, "isAbstractOpen"], toggledValue);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS: {
      const toggledValue = !state.getIn(["searchItemsInfo", action.payload.index, "isCommentsOpen"]);

      return state.setIn(["searchItemsInfo", action.payload.index, "isCommentsOpen"], toggledValue);
    }

    default:
      return state;
  }
}
