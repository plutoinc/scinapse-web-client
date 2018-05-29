import { ACTION_TYPES } from "../actions/actionTypes";
import { initialBookmarkState, Bookmark } from "../model/bookmark";

export function reducer(state: Bookmark = initialBookmarkState, action: ReduxAction<any>): Bookmark {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: {
      return { ...state, bookmarkData: action.payload.bookmarks, totalBookmarkCount: action.payload.bookmarkCount };
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_POST_BOOKMARK: {
      return { ...state, totalBookmarkCount: state.totalBookmarkCount + 1 };
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_REMOVE_BOOKMARK: {
      return { ...state, totalBookmarkCount: state.totalBookmarkCount - 1 };
    }

    default:
      return state;
  }
}
