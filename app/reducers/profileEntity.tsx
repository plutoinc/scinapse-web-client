import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../model/profile';

export interface ProfileEntities {
  [profileId: string]: Profile;
}
export const PROFILE_ENTITIES_INITIAL_STATE: ProfileEntities = {};

const profileEntitiesSlice = createSlice({
  name: 'profileEntitiesSlice',
  initialState: PROFILE_ENTITIES_INITIAL_STATE,
  reducers: {
    addProfileEntities(state, action: PayloadAction<{ profileEntities: ProfileEntities }>) {
      return {
        ...state,
        ...action.payload.profileEntities,
      };
    },
  },
});

export const { addProfileEntities } = profileEntitiesSlice.actions;

export default profileEntitiesSlice.reducer;
