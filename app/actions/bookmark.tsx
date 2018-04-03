import { Dispatch } from "react-redux";
import MemberAPI from "../api/member";
import { ACTION_TYPES } from "./actionTypes";
import { PaperRecord, PaperList } from "../model/paper";

export function postBookmark(paper: PaperRecord) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.GLOBAL_START_TO_POST_BOOKMARK,
      payload: {
        paper,
      },
    });

    try {
      await MemberAPI.postBookmark(paper);

      dispatch({
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_POST_BOOKMARK,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.GLOBAL_FAILED_TO_POST_BOOKMARK,
        payload: {
          paper,
        },
      });
    }
  };
}

export function getBookmarkedStatus(paperList: PaperList) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.GLOBAL_START_TO_CHECK_BOOKMARKED_STATUS });
    try {
      const res = await MemberAPI.checkBookmarked(paperList);

      dispatch({
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS,
        payload: {
          checkedStatusArray: res,
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.GLOBAL_FAILED_TO_CHECK_BOOKMARKED_STATUS,
      });
    }
  };
}
