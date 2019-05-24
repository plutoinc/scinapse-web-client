import { Actions, ACTION_TYPES } from "../actions/actionTypes";

export interface PDFViewerState {
  isExpanded: boolean;
  isLoading: boolean;
  isOpenBlockedPopper: boolean;
  hasFailed: boolean;
  pdfBlob: Blob | null;
  hasClickedDownloadBtn: boolean;
  pageCountToShow: number;
  pageCount: number;
  parsedPDFObject: any;
}

export const PDF_VIEWER_INITIAL_STATE: PDFViewerState = {
  isExpanded: false,
  isLoading: false,
  isOpenBlockedPopper: false,
  hasFailed: false,
  pdfBlob: null,
  hasClickedDownloadBtn: false,
  pageCountToShow: 1,
  pageCount: 0,
  parsedPDFObject: null,
};

export function reducer(state = PDF_VIEWER_INITIAL_STATE, action: Actions): PDFViewerState {
  switch (action.type) {
    case ACTION_TYPES.PDF_VIEWER_START_TO_FETCH_PDF: {
      return { ...PDF_VIEWER_INITIAL_STATE, isLoading: true };
    }

    case ACTION_TYPES.PDF_VIEWER_SET_PDF_BLOB: {
      return {
        ...state,
        isLoading: false,
        hasFailed: false,
        pdfBlob: action.payload.blob,
      };
    }

    case ACTION_TYPES.PDF_VIEWER_SUCCEED_TO_FETCH_PDF: {
      return {
        ...state,
        pageCount: action.payload.pdf.numPages,
        parsedPDFObject: action.payload.pdf,
        isLoading: false,
        hasFailed: false,
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

    case ACTION_TYPES.PDF_VIEWER_TOGGLE_BLOCKED_POPPER: {
      return { ...state, isOpenBlockedPopper: action.payload.isOpenBlockedPopper };
    }
  }

  return state;
}