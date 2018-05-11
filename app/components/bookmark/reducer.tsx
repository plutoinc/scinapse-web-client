import { INITIAL_BOOKMARK_PAGE_STATE, BookmarkPageStateRecord } from "./records";
import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { AvailableCitationType } from "../paperShow/records";

export function reducer(state = INITIAL_BOOKMARK_PAGE_STATE, action: IReduxAction<any>): BookmarkPageStateRecord {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState.set("hasError", false).set("isLoading", true);
      });
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState
          .set("hasError", false)
          .set("isLoading", false)
          .set("isEnd", action.payload.last)
          .set("totalPageCount", action.payload.totalPages)
          .set("currentPage", action.payload.currentPage);
      });
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_GET_BOOKMARK: {
      return state.withMutations(currentState => {
        return currentState.set("hasError", true).set("isLoading", false);
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
