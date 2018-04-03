import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { BOOKMARK_PAPERS_INITIAL_STATE } from "../model/bookmark";
import { PaperList } from "../model/paper";

export function reducer(state = BOOKMARK_PAPERS_INITIAL_STATE, action: IReduxAction<any>): PaperList {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: {
      return state.concat(action.payload.bookmarks) as PaperList;
    }

    default:
      return state;
  }
}
