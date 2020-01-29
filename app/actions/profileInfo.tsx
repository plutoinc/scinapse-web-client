import { normalize } from 'normalizr';
import { AppThunkAction } from '../store/types';
import { ProfileInfo, profileInfoSchema } from '../model/profileInfo';
import { addProfileInfoEntities } from '../reducers/profileInfoEntity';

export function getProfileCVInformation(profileId: string): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    try {
      const res = await axios.get(`/profiles/${profileId}/information`);
      const profile: ProfileInfo = res.data.data.content;
      const normalizedData = normalize({ ...profile, profileId }, profileInfoSchema);
      dispatch(addProfileInfoEntities(normalizedData.entities));
    } catch (err) {
      // TODO: handle error state
    }
  };
}
