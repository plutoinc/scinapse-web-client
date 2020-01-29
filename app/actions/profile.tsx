import { normalize } from 'normalizr';
import { ProfileParams } from '../api/profile';
import { AppThunkAction } from '../store/types';
import { profileEntitySchema } from '../model/profile';
import { addProfileEntities } from '../reducers/profileEntity';
import alertToast from '../helpers/makePlutoToastAction';

export function fetchProfileData(profileId: string): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    const res = await axios.get(`/profiles/${profileId}`);
    const normalizedData = normalize(res.data.data.content, profileEntitySchema);
    dispatch(addProfileEntities(normalizedData.entities));
  };
}

export function updateProfile(params: Partial<ProfileParams> & { id: string }): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    try {
      await axios.put(`/profiles/${params.id}`, params);
      await dispatch(fetchProfileData(params.id));
    } catch (err) {
      alertToast({
        type: 'error',
        message: 'Had an error to update user profile.',
      });
    }
  };
}
