import { ACTION_TYPES } from "../../actions/actionTypes";
import { Dispatch } from "react-redux";
import CompletionAPI from "../../api/completion";
import memberAPI, { GetMyBookmarksParams } from "../../api/member";

export function reachScrollTop() {
  return {
    type: ACTION_TYPES.HEADER_REACH_SCROLL_TOP,
  };
}

export function leaveScrollTop() {
  return {
    type: ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP,
  };
}

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

export function setUserDropdownAnchorElement(element: React.ReactInstance) {
  return {
    type: ACTION_TYPES.GLOBAL_SET_USER_DROPDOWN_ANCHOR_ELEMENT,
    payload: {
      element,
    },
  };
}

export function toggleUserDropdown() {
  return {
    type: ACTION_TYPES.GLOBAL_TOGGLE_USER_DROPDOWN,
  };
}

export function closeUserDropdown() {
  return {
    type: ACTION_TYPES.GLOBAL_CLOSE_USER_DROPDOWN,
  };
}

export function getBookmarks(params: GetMyBookmarksParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK,
    });

    try {
      const res = await memberAPI.getMyBookmarks(params);
      const bookmarkCount = res.totalElements;

      dispatch({
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK,
        payload: {
          bookmarkCount,
          bookmarks: res.content,
          currentPage: res.number,
          totalPages: res.totalPages,
          last: res.last,
        },
      });

      return res.content;
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.GLOBAL_FAILED_TO_GET_BOOKMARK,
      });
    }
  };
}

export function getKeywordCompletion(query: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.HEADER_START_TO_GET_KEYWORD_COMPLETION,
    });

    try {
      const keywordList = await CompletionAPI.getKeywordCompletion(query);

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
