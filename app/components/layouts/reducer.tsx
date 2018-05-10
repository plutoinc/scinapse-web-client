import { IReduxAction } from "../../typings/actionType";
import { LayoutStateRecord, LAYOUT_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { List } from "immutable";

export function reducer(state = LAYOUT_INITIAL_STATE, action: IReduxAction<any>): LayoutStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SET_DEVICE_TO_DESKTOP: {
      return state.set("isMobile", false);
    }

    case ACTION_TYPES.SET_DEVICE_TO_MOBILE: {
      return state.set("isMobile", true);
    }

    case ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState.set("isBookmarkLoading", true).set("hasErrorOnFetchingBookmark", false);
      });
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState.set("isBookmarkLoading", false);
      });
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState.set("isBookmarkLoading", false).set("hasErrorOnFetchingBookmark", true);
      });
    }

    case ACTION_TYPES.HEADER_START_TO_GET_KEYWORD_COMPLETION: {
      return state.set("isLoadingKeywordCompletion", true);
    }

    case ACTION_TYPES.HEADER_SUCCEEDED_TO_GET_KEYWORD_COMPLETION: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoadingKeywordCompletion", false)
          .set("completionKeywordList", action.payload.keywordList);
      });
    }

    case ACTION_TYPES.HEADER_CLEAR_KEYWORD_COMPLETION: {
      return state.set("completionKeywordList", List());
    }

    case ACTION_TYPES.HEADER_FAILED_TO_GET_KEYWORD_COMPLETION: {
      return state.set("isLoadingKeywordCompletion", false);
    }

    case ACTION_TYPES.HEADER_OPEN_KEYWORD_COMPLETION: {
      return state.set("isKeywordCompletionOpen", true);
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE:
    case ACTION_TYPES.HEADER_ClOSE_KEYWORD_COMPLETION: {
      return state.set("isKeywordCompletionOpen", false);
    }

    default:
      return state;
  }
}
