import { LayoutState, LAYOUT_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(
  state: LayoutState = LAYOUT_INITIAL_STATE,
  action: ReduxAction<any>
): LayoutState {
  switch (action.type) {
    case ACTION_TYPES.SET_DEVICE_TO_DESKTOP: {
      return { ...state, isMobile: false };
    }

    case ACTION_TYPES.SET_DEVICE_TO_MOBILE: {
      return { ...state, isMobile: true };
    }

    case ACTION_TYPES.HEADER_START_TO_GET_KEYWORD_COMPLETION: {
      return { ...state, isLoadingKeywordCompletion: true };
    }

    case ACTION_TYPES.HEADER_SUCCEEDED_TO_GET_KEYWORD_COMPLETION: {
      return {
        ...state,
        isLoadingKeywordCompletion: false,
        completionKeywordList: action.payload.keywordList
      };
    }

    case ACTION_TYPES.HEADER_CLEAR_KEYWORD_COMPLETION: {
      return { ...state, completionKeywordList: [] };
    }

    case ACTION_TYPES.HEADER_FAILED_TO_GET_KEYWORD_COMPLETION: {
      return { ...state, isLoadingKeywordCompletion: false };
    }

    case ACTION_TYPES.HEADER_OPEN_KEYWORD_COMPLETION: {
      return { ...state, isKeywordCompletionOpen: true };
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE:
    case ACTION_TYPES.HEADER_ClOSE_KEYWORD_COMPLETION: {
      return { ...state, completionKeywordList: [], isKeywordCompletionOpen: false };
    }

    default:
      return state;
  }
}
