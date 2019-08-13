import { createSelector } from 'reselect';
import { AppState } from '../reducers';

export const getMemoizedCurrentUser = createSelector(
  (state: AppState) => state.currentUser,
  currentUser => currentUser
);
