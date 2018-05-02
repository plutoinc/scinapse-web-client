import { IReduxAction } from "../../typings/actionType";
import { HomeStateRecord, HOME_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { List } from "immutable";

export function reducer(state = HOME_INITIAL_STATE, action: IReduxAction<any>): HomeStateRecord {
  switch (action.type) {
    case ACTION_TYPES.HOME_START_TO_GET_KEYWORD_COMPLETION: {
      return state.set("isLoadingKeywordCompletion", true);
    }

    case ACTION_TYPES.HOME_SUCCEEDED_TO_GET_KEYWORD_COMPLETION: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoadingKeywordCompletion", false)
          .set("completionKeywordList", action.payload.keywordList);
      });
    }

    case ACTION_TYPES.HOME_CLEAR_KEYWORD_COMPLETION: {
      return state.set("completionKeywordList", List());
    }

    case ACTION_TYPES.HOME_FAILED_TO_GET_KEYWORD_COMPLETION: {
      return state.set("isLoadingKeywordCompletion", false);
    }

    case ACTION_TYPES.HOME_OPEN_KEYWORD_COMPLETION: {
      return state.set("isKeywordCompletionOpen", true);
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE:
    case ACTION_TYPES.HOME_ClOSE_KEYWORD_COMPLETION: {
      return state.set("isKeywordCompletionOpen", false);
    }

    default:
      return state;
  }
}
