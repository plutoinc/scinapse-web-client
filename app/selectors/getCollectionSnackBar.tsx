import { createSelector } from 'redux-starter-kit';
import { AppState } from '../reducers';

export const getMemorizedCollectionSnackBar = createSelector(
  [(state: AppState) => state.collectionSnackBarState],
  collectionSnackBarState => {
    return collectionSnackBarState;
  }
);
