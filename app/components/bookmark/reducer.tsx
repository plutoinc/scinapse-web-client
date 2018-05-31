import { INITIAL_BOOKMARK_PAGE_STATE, BookmarkPageState } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { AvailableCitationType } from "../paperShow/records";

export function reducer(
  state: BookmarkPageState = INITIAL_BOOKMARK_PAGE_STATE,
  action: ReduxAction<any>,
): BookmarkPageState {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_START_TO_GET_BOOKMARK: {
      return { ...state, hasError: false, isLoading: true };
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: {
      return {
        ...state,
        hasError: false,
        isLoading: false,
        isEnd: action.payload.last,
        totalPageCount: action.payload.totalPages,
        currentPage: action.payload.currentPage,
      };
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_GET_BOOKMARK: {
      return { ...state, hasError: true, isLoading: false };
    }

    case ACTION_TYPES.BOOKMARK_PAGE_SET_ACTIVE_CITATION_DIALOG_PAPER_ID: {
      return { ...state, activeCitationDialogPaperId: action.payload.paperId };
    }

    case ACTION_TYPES.BOOKMARK_PAGE_TOGGLE_CITATION_DIALOG: {
      return { ...state, isCitationDialogOpen: !state.isCitationDialogOpen };
    }

    case ACTION_TYPES.BOOKMARK_PAGE_CLICK_CITATION_TAB: {
      const payload: { tab: AvailableCitationType } = action.payload;

      return { ...state, activeCitationTab: payload.tab };
    }

    case ACTION_TYPES.BOOKMARK_PAGE_START_TO_GET_CITATION_TEXT: {
      return { ...state, citationText: "", isFetchingCitationInformation: true };
    }

    case ACTION_TYPES.BOOKMARK_PAGE_SUCCEEDED_GET_CITATION_TEXT: {
      const payload: { citationText: string } = action.payload;

      return { ...state, citationText: payload.citationText, isFetchingCitationInformation: false };
    }

    case ACTION_TYPES.BOOKMARK_PAGE_CLEAR_BOOkMARK_PAGE_STATE: {
      return INITIAL_BOOKMARK_PAGE_STATE;
    }

    default:
      return state;
  }
}
