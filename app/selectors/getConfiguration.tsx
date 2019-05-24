import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const getMemoizedConfiguration = createSelector([(state: AppState) => state.configuration], configuration => {
  return configuration;
});
