import { ACTION_TYPES } from "../../actions/actionTypes";
import { Dispatch } from "react-redux";
import CompletionAPI from "../../api/completion";

export function setDeviceToDesktop() {
  return {
    type: ACTION_TYPES.SET_DEVICE_TO_DESKTOP,
  };
}

export function setDeviceToMobile() {
  return {
    type: ACTION_TYPES.SET_DEVICE_TO_MOBILE,
  };
}

export function setDeviceToTablet() {
  return {
    type: ACTION_TYPES.SET_DEVICE_TO_TABLET,
  };
}

export function getKeywordCompletion(query: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.HEADER_START_TO_GET_KEYWORD_COMPLETION,
    });

    try {
      const keywordList = await CompletionAPI.fetchSuggestionKeyword(query);

      dispatch({
        type: ACTION_TYPES.HEADER_SUCCEEDED_TO_GET_KEYWORD_COMPLETION,
        payload: {
          keywordList,
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.HEADER_FAILED_TO_GET_KEYWORD_COMPLETION,
      });
    }
  };
}

export function openKeywordCompletion() {
  return {
    type: ACTION_TYPES.HEADER_OPEN_KEYWORD_COMPLETION,
  };
}

export function closeKeywordCompletion() {
  return {
    type: ACTION_TYPES.HEADER_ClOSE_KEYWORD_COMPLETION,
  };
}

export function clearKeywordCompletion() {
  return {
    type: ACTION_TYPES.HEADER_CLEAR_KEYWORD_COMPLETION,
  };
}
