import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../reducers';

export const getMemoizedLayout = createSelector([(state: AppState) => state.layout], layout => {
  return layout;
});
