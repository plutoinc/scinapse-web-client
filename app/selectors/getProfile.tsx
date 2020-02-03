import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { selectHydratedProfile } from '../model/profile';

export const getMemorizedProfile = createSelector(
  [(state: AppState) => state, (state: AppState) => state.currentUser.profileId],
  (state, profileId) => {
    return selectHydratedProfile(state, profileId || undefined);
  }
);
