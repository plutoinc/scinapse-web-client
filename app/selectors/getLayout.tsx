import { createSelector } from 'redux-starter-kit';
import { AppState } from '../reducers';

export const getMemoizedLayout = createSelector([(state: AppState) => state.layout], layout => {
  return layout;
});
