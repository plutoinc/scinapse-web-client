import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface PDFViewerState {
  isExpanded: boolean;
  isLoading: boolean;
  hasFailed: boolean;
  hasSucceed: boolean;
  hasClickedDownloadBtn: boolean;
  pageCountToShow: number;
  pageCount: number;
}

export const PDF_VIEWER_INITIAL_STATE: PDFViewerState = {
  isExpanded: false,
  isLoading: false,
  hasFailed: false,
  hasSucceed: false,
  hasClickedDownloadBtn: false,
  pageCountToShow: 1,
  pageCount: 0,
};

export function reducer(state = PDF_VIEWER_INITIAL_STATE, action: Actions): PDFViewerState {
  switch (action.type) {
    case ACTION_TYPES.PDF_VIEWER_START_TO_FETCH_PDF: {
      return { ...PDF_VIEWER_INITIAL_STATE, isLoading: true };
    }

    case ACTION_TYPES.PDF_VIEWER_SUCCEED_TO_FETCH_PDF: {
      return {
        ...state,
        pageCount: action.payload.pageCount,
        isLoading: false,
        hasFailed: false,
        hasSucceed: true,
      };
    }

    case ACTION_TYPES.PDF_VIEWER_CLICK_DOWNLOAD_BTN: {
      return { ...state, hasClickedDownloadBtn: true, isExpanded: false };
    }

    case ACTION_TYPES.PDF_VIEWER_CLICK_RELOAD_BTN: {
      return { ...state, hasClickedDownloadBtn: false };
    }

    case ACTION_TYPES.PDF_VIEWER_CLICK_VIEW_MORE_BTN: {
      return { ...state, isExpanded: true, pageCountToShow: state.pageCount };
    }

    case ACTION_TYPES.PDF_VIEWER_FAIL_TO_FETCH_PDF: {
      return { ...state, isLoading: false, hasFailed: true };
    }
  }

  return state;
}
