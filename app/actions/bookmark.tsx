import { Dispatch } from "react-redux";
import MemberAPI from "../api/member";
import { ACTION_TYPES } from "./actionTypes";
import { PaperRecord, Paper } from "../model/paper";

// TODO: REMOVE PaperRecord later
export function postBookmark(paper: PaperRecord | Paper) {
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

      throw err;
    }
  };
}

// TODO: REMOVE PaperRecord later
export function removeBookmark(paper: PaperRecord | Paper) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.GLOBAL_START_TO_REMOVE_BOOKMARK,
      payload: {
        paper,
      },
    });

    try {
      await MemberAPI.removeBookmark(paper);

      dispatch({
        type: ACTION_TYPES.GLOBAL_SUCCEEDED_REMOVE_BOOKMARK,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_BOOKMARK,
        payload: {
          paper,
        },
      });
    }
  };
}
