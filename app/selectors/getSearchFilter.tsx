import { createSelector } from 'reselect';
import { AppState } from '../reducers';

export const getMemoizedSearchFilterState = createSelector(
  [(state: AppState) => state.searchFilterState],
  searchFilterState => {
    return searchFilterState;
  }
);
