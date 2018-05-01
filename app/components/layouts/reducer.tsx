import { IReduxAction } from "../../typings/actionType";
import { LayoutStateRecord, LAYOUT_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = LAYOUT_INITIAL_STATE, action: IReduxAction<any>): LayoutStateRecord {
  switch (action.type) {
    case ACTION_TYPES.HEADER_REACH_SCROLL_TOP: {
      return state.set("isTop", true);
    }

    case ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP: {
      return state.set("isTop", false);
    }

    case ACTION_TYPES.SET_DEVICE_TO_DESKTOP: {
      return state.set("isMobile", false);
    }

    case ACTION_TYPES.SET_DEVICE_TO_MOBILE: {
      return state.set("isMobile", true);
    }

    case ACTION_TYPES.GLOBAL_SET_USER_DROPDOWN_ANCHOR_ELEMENT: {
      return state.set("userDropdownAnchorElement", action.payload.element);
    }

    case ACTION_TYPES.GLOBAL_TOGGLE_USER_DROPDOWN: {
      return state.set("isUserDropdownOpen", !state.isUserDropdownOpen);
    }

    case ACTION_TYPES.GLOBAL_CLOSE_USER_DROPDOWN: {
      return state.set("isUserDropdownOpen", false);
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
      return state.withMutations(currentState => {
        return currentState.set("isBookmarkLoading", true);
      });
    }

    case ACTION_TYPES.HEADER_SUCCEEDED_TO_GET_KEYWORD_COMPLETION: {
      return state.withMutations(currentState => {
        return currentState.set("isBookmarkLoading", false).set("completionKeywordList", action.payload.keywordList);
      });
    }

    case ACTION_TYPES.HEADER_FAILED_TO_GET_KEYWORD_COMPLETION: {
      return state.withMutations(currentState => {
        return currentState.set("isBookmarkLoading", false);
      });
    }

    case ACTION_TYPES.HEADER_OPEN_KEYWORD_COMPLETION: {
      return state.set("isKeywordCompletionOpen", true);
    }

    case ACTION_TYPES.HEADER_ClOSE_KEYWORD_COMPLETION: {
      return state.set("isKeywordCompletionOpen", false);
    }

    default:
      return state;
  }
}
