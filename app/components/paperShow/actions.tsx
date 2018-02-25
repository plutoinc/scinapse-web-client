import { Dispatch } from "redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import PaperAPI, { GetpaperParams } from "../../api/paper";

export function getPaper(params: GetpaperParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER,
      });

      const paper = await PaperAPI.getPaper(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
        payload: {
          paper,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAEPR,
      });
    }
  };
}

export function clearPaperShowState() {
  return {
    type: ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE,
  };
}
