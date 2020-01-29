import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileInfo } from '../model/profileInfo';

export interface ProfileInfoEntities {
  [profileInfoId: string]: ProfileInfo;
}
export const PROFILE_INFO_ENTITIES_INITIAL_STATE: ProfileInfoEntities = {};

const profileInfoEntitiesSlice = createSlice({
  name: 'profileInfoEntitiesSlice',
  initialState: PROFILE_INFO_ENTITIES_INITIAL_STATE,
  reducers: {
    addProfileInfoEntities(state, action: PayloadAction<{ profileInfoEntities: ProfileInfoEntities }>) {
      return {
        ...state,
        ...action.payload.profileInfoEntities,
      };
    },
  },
});

export const { addProfileInfoEntities } = profileInfoEntitiesSlice.actions;

export default profileInfoEntitiesSlice.reducer;
