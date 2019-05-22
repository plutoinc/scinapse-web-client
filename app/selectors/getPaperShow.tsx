import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const getMemoizedPaperShow = createSelector([(state: AppState) => state.paperShow], paperShow => {
  return paperShow;
});
