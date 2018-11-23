import { HomeState, HOME_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state: HomeState = HOME_INITIAL_STATE, action: ReduxAction<any>): HomeState {
  switch (action.type) {
    case ACTION_TYPES.HOME_START_TO_GET_KEYWORD_COMPLETION: {
      return { ...state, isLoadingKeywordCompletion: true };
    }

    case ACTION_TYPES.HOME_SUCCEEDED_TO_GET_KEYWORD_COMPLETION: {
      return { ...state, isLoadingKeywordCompletion: false, completionKeywordList: action.payload.keywordList };
    }

    case ACTION_TYPES.HOME_CLEAR_KEYWORD_COMPLETION: {
      return { ...state, completionKeywordList: [] };
    }

    case ACTION_TYPES.HOME_FAILED_TO_GET_KEYWORD_COMPLETION: {
      return { ...state, isLoadingKeywordCompletion: false };
    }

    case ACTION_TYPES.HOME_OPEN_KEYWORD_COMPLETION: {
      return { ...state, isKeywordCompletionOpen: true };
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE:
    case ACTION_TYPES.HOME_ClOSE_KEYWORD_COMPLETION: {
      return { ...state, completionKeywordList: [], isKeywordCompletionOpen: false };
    }

    default:
      return state;
  }
}
