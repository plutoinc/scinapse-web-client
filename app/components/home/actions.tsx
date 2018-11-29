import { Dispatch } from "react-redux";
import CompletionAPI from "../../api/completion";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function getKeywordCompletion(query: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.HOME_START_TO_GET_KEYWORD_COMPLETION,
    });

    try {
      const keywordList = await CompletionAPI.getKeywordCompletion(query);
      const slicedKeywordList = keywordList.slice(0, 5);

      dispatch({
        type: ACTION_TYPES.HOME_SUCCEEDED_TO_GET_KEYWORD_COMPLETION,
        payload: {
          keywordList: slicedKeywordList,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.HOME_FAILED_TO_GET_KEYWORD_COMPLETION,
      });
    }
  };
}

export function closeKeywordCompletion() {
  return {
    type: ACTION_TYPES.HOME_ClOSE_KEYWORD_COMPLETION,
  };
}

export function clearKeywordCompletion() {
  return {
    type: ACTION_TYPES.HOME_CLEAR_KEYWORD_COMPLETION,
  };
}

export function openKeywordCompletion() {
  return {
    type: ACTION_TYPES.HOME_OPEN_KEYWORD_COMPLETION,
  };
}
