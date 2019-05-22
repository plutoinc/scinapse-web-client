import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const getMemoizedPDFViewerState = createSelector([(state: AppState) => state.PDFViewerState], PDFViewerState => {
  return PDFViewerState;
});
