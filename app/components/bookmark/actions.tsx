import { ACTION_TYPES } from "../../actions/actionTypes";
import { AvailableCitationType } from "../paperShow/records";
import PaperAPI, { GetCitationTextParams } from "../../api/paper";
import { Dispatch } from "react-redux";

export function clearBookmarkPageState() {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_CLEAR_BOOkMARK_PAGE_STATE,
  };
}

export function setActiveCitationDialogPaperId(paperId: number) {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_SET_ACTIVE_CITATION_DIALOG_PAPER_ID,
    payload: {
      paperId,
    },
  };
}

export function toggleCitationDialog() {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_TOGGLE_CITATION_DIALOG,
  };
}

export function toggleAbstract(paperId: number) {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_TOGGLE_ABSTRACT,
    payload: {
      paperId,
    },
  };
}

export function toggleAuthors(paperId: number) {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_TOGGLE_AUTHORS,
    payload: {
      paperId,
    },
  };
}

export function visitTitle(paperId: number) {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_VISIT_TITLE,
    payload: {
      paperId,
    },
  };
}

export function closeFirstOpen(paperId: number) {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_CLOSE_FIRST_OPEN,
    payload: {
      paperId,
    },
  };
}

export function handleClickCitationTab(citationTab: AvailableCitationType) {
  return {
    type: ACTION_TYPES.BOOKMARK_PAGE_CLICK_CITATION_TAB,
    payload: {
      tab: citationTab,
    },
  };
}

export function getCitationText(params: GetCitationTextParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.BOOKMARK_PAGE_START_TO_GET_CITATION_TEXT,
    });

    try {
      const response = await PaperAPI.getCitationText(params);

      dispatch({
        type: ACTION_TYPES.BOOKMARK_PAGE_SUCCEEDED_GET_CITATION_TEXT,
        payload: {
          citationText: response.citationText,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.BOOKMARK_PAGE_FAILED_TO_GET_CITATION_TEXT,
      });
    }
  };
}
