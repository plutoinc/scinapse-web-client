import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { initialBookmarkState, BookmarkRecord } from "../model/bookmark";

export function reducer(state = initialBookmarkState, action: IReduxAction<any>): BookmarkRecord {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState
          .set("bookmarkData", action.payload.bookmarks)
          .set("totalBookmarkCount", action.payload.bookmarkCount);
      });
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_POST_BOOKMARK: {
      return state.set("totalBookmarkCount", state.totalBookmarkCount + 1);
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_REMOVE_BOOKMARK: {
      return state.set("totalBookmarkCount", state.totalBookmarkCount - 1);
    }

    default:
      return state;
  }
}
