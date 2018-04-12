import { INITIAL_BOOKMARK_PAGE_STATE, BookmarkPageStateRecord } from "./records";
import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { makeSearchItemMetaListFromPaperList, SearchItemMetaRecord } from "../articleSearch/records";
import { CheckBookmarkedResponse } from "../../api/member";
import { AvailableCitationType } from "../paperShow/records";
import { BookmarkDataRecord } from "../../model/bookmark";

export function reducer(state = INITIAL_BOOKMARK_PAGE_STATE, action: IReduxAction<any>): BookmarkPageStateRecord {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState.set("hasError", false).set("isLoading", true);
      });
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: {
      const paperList = action.payload.bookmarks.map((bookmarkData: BookmarkDataRecord) => bookmarkData.paper).toList();
      return state.withMutations(currentState => {
        return currentState
          .set("hasError", false)
          .set("isLoading", false)
          .set("isEnd", action.payload.last)
          .set("totalPageCount", action.payload.totalPages)
          .set("bookmarkItemMetaList", makeSearchItemMetaListFromPaperList(paperList))
          .set("currentPage", action.payload.currentPage);
      });
    }

    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_BOOKMARK: {
      return state.update("bookmarkItemMetaList", metaList => {
        const key = metaList.findKey((meta: SearchItemMetaRecord) => meta.paperId === action.payload.paper.id);

        if (key !== undefined) {
          return metaList.setIn([key, "isBookmarked"], false);
        } else {
          return metaList;
        }
      });
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_BOOKMARK: {
      return state.update("bookmarkItemMetaList", metaList => {
        const key = metaList.findKey((meta: SearchItemMetaRecord) => meta.paperId === action.payload.paper.id);

        if (key !== undefined) {
          return metaList.setIn([key, "isBookmarked"], true);
        } else {
          return metaList;
        }
      });
    }

    case ACTION_TYPES.GLOBAL_START_TO_POST_BOOKMARK: {
      return state.update("bookmarkItemMetaList", metaList => {
        const key = metaList.findKey((meta: SearchItemMetaRecord) => meta.paperId === action.payload.paper.id);

        if (key !== undefined) {
          return metaList.setIn([key, "isBookmarked"], true);
        } else {
          return metaList;
        }
      });
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_POST_BOOKMARK: {
      return state.update("bookmarkItemMetaList", metaList => {
        const key = metaList.findKey((meta: SearchItemMetaRecord) => meta.paperId === action.payload.paper.id);

        if (key !== undefined) {
          return metaList.setIn([key, "isBookmarked"], false);
        } else {
          return metaList;
        }
      });
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState.set("hasError", true).set("isLoading", false);
      });
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS: {
      const checkedStatusArray = action.payload.checkedStatusArray as CheckBookmarkedResponse[];

      // TODO: O(N^2) -> O(NlogN?)
      return state.update("bookmarkItemMetaList", metaList => {
        return metaList.map((meta: SearchItemMetaRecord) => {
          const checkedStatus = checkedStatusArray.find(status => status.paperId === meta.paperId);

          if (checkedStatus) {
            return meta.set("isBookmarked", checkedStatus.bookmarked);
          } else {
            return meta;
          }
        });
      });
    }

    case ACTION_TYPES.BOOKMARK_PAGE_SET_ACTIVE_CITATION_DIALOG_PAPER_ID: {
      return state.set("activeCitationDialogPaperId", action.payload.paperId);
    }

    case ACTION_TYPES.BOOKMARK_PAGE_TOGGLE_CITATION_DIALOG: {
      return state.set("isCitationDialogOpen", !state.isCitationDialogOpen);
    }

    case ACTION_TYPES.BOOKMARK_PAGE_CLEAR_BOOkMARK_PAGE_STATE: {
      return INITIAL_BOOKMARK_PAGE_STATE;
    }

    case ACTION_TYPES.BOOKMARK_PAGE_TOGGLE_ABSTRACT: {
      const key = state.bookmarkItemMetaList.findKey(meta => meta.paperId === action.payload.paperId);

      const currentValue = state.bookmarkItemMetaList.get(key).isAbstractOpen;

      if (key !== undefined) {
        return state.setIn(["bookmarkItemMetaList", key, "isAbstractOpen"], !currentValue);
      } else {
        return state;
      }
    }

    case ACTION_TYPES.BOOKMARK_PAGE_TOGGLE_AUTHORS: {
      const key = state.bookmarkItemMetaList.findKey(meta => meta.paperId === action.payload.paperId);

      const currentValue = state.bookmarkItemMetaList.get(key).isAuthorsOpen;

      if (key !== undefined) {
        return state.setIn(["bookmarkItemMetaList", key, "isAuthorsOpen"], !currentValue);
      } else {
        return state;
      }
    }

    case ACTION_TYPES.BOOKMARK_PAGE_VISIT_TITLE: {
      const key = state.bookmarkItemMetaList.findKey(meta => meta.paperId === action.payload.paperId);

      if (key !== undefined) {
        return state.setIn(["bookmarkItemMetaList", key, "isTitleVisited"], true);
      } else {
        return state;
      }
    }

    case ACTION_TYPES.BOOKMARK_PAGE_CLOSE_FIRST_OPEN: {
      const key = state.bookmarkItemMetaList.findKey(meta => meta.paperId === action.payload.paperId);

      if (key !== undefined) {
        return state.setIn(["bookmarkItemMetaList", key, "isFirstOpen"], false);
      } else {
        return state;
      }
    }

    case ACTION_TYPES.BOOKMARK_PAGE_CLICK_CITATION_TAB: {
      const payload: { tab: AvailableCitationType } = action.payload;

      return state.set("activeCitationTab", payload.tab);
    }

    case ACTION_TYPES.BOOKMARK_PAGE_START_TO_GET_CITATION_TEXT: {
      return state.withMutations(currentState => {
        return currentState.set("citationText", "").set("isFetchingCitationInformation", true);
      });
    }

    case ACTION_TYPES.BOOKMARK_PAGE_SUCCEEDED_GET_CITATION_TEXT: {
      const payload: { citationText: string } = action.payload;

      return state.withMutations(currentState => {
        return currentState.set("citationText", payload.citationText).set("isFetchingCitationInformation", false);
      });
    }

    default:
      return state;
  }
}
