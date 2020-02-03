import { normalize } from 'normalizr';
import { ProfileParams } from '../api/profile';
import { AppThunkAction } from '../store/types';
import { profileEntitySchema } from '../model/profile';
import { addProfileEntities } from '../reducers/profileEntity';
import alertToast from '../helpers/makePlutoToastAction';
import { PaginationResponseV2 } from '../api/types/common';
import { Paper, paperSchema } from '../model/paper';
import { ActionCreators } from './actionTypes';
import { getPapers } from '../reducers/profilePaperList';

interface FetchProfilePaperListParams {
  profileId: string;
  page: number;
}

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

export function fetchProfilePapers(params: FetchProfilePaperListParams): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    const { profileId } = params;
    const result = await axios.get(`/profiles/${profileId}/papers`, {
      params: { page: params.page },
    });
    const { data } = result.data as PaginationResponseV2<Paper>;
    const papers = data.content;
    const entity = normalize(papers, [paperSchema]);

    dispatch(ActionCreators.addEntity(entity));
    dispatch(
      getPapers({
        paperIds: entity.result,
        totalPages: data.page!.totalPages,
        page: data.page!.page,
        totalElements: data.page!.totalElements,
      })
    );
  };
}
