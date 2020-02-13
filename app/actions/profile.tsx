import { normalize } from 'normalizr';
import { ProfileParams, ImportedPaperListResponse } from '../api/profile';
import { AppThunkAction } from '../store/types';
import { profileEntitySchema, Profile } from '../model/profile';
import { addProfileEntities } from '../reducers/profileEntity';
import alertToast from '../helpers/makePlutoToastAction';
import { PaginationResponseV2 } from '../api/types/common';
import { Paper, paperSchema } from '../model/paper';
import { ActionCreators } from './actionTypes';
import { getPapers } from '../reducers/profilePaperList';
import { getPendingPapers, PendingPaper } from '../reducers/profilePendingPaperList';
import { IMPORT_SOURCE_TAB } from '../containers/profile/components/paperImportDialogBody';

interface FetchProfilePaperListParams {
  profileSlug: string;
  page: number;
}

export function fetchProfileData(profileSlug: string): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    const res = await axios.get(`/profiles/${profileSlug}`);
    const profileData = { ...(res.data.data.content as Profile) };

    // const profileData = { ...(res.data.data.content as Profile), isEditable: false };
    const normalizedData = normalize(profileData, profileEntitySchema);
    dispatch(addProfileEntities(normalizedData.entities));
  };
}

export function updateProfile(params: Partial<ProfileParams> & { id: string }): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    try {
      const res = await axios.put(`/profiles/${params.id}`, params);
      const profileData = { ...(res.data.data.content as Profile) };

      // const profileData = { ...(res.data.data.content as Profile), isEditable: false };
      const normalizedData = normalize(profileData, profileEntitySchema);
      dispatch(addProfileEntities(normalizedData.entities));
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
    const { profileSlug, page } = params;
    const result = await axios.get(`/profiles/${profileSlug}/papers`, { params: { page } });
    const { data } = result.data as PaginationResponseV2<Paper[]>;
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

export function fetchProfilePendingPapers(profileSlug: string): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    const result = await axios.get(`/profiles/${profileSlug}/papers/pending`);
    const { data } = result.data as PaginationResponseV2<PendingPaper[]>;
    const papers = data.content;

    dispatch(getPendingPapers({ papers }));
  };
}

export function fetchProfileImportedPapers(
  importSource: IMPORT_SOURCE_TAB,
  profileSlug: string,
  importedContext: string | string[]
): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    let rawRes;

    try {
      if (importSource === IMPORT_SOURCE_TAB.GS) {
        rawRes = await axios.post(`/profiles/${profileSlug}/import-papers/gs`, {
          gs_uri: importedContext,
        });
      } else if (importSource === IMPORT_SOURCE_TAB.BIBTEX) {
        rawRes = await axios.post(`/profiles/${profileSlug}/import-papers/bibtex`, {
          bibtex_string: importedContext,
        });
      } else if (importSource === IMPORT_SOURCE_TAB.CITATION) {
        rawRes = await axios.post(`/profiles/${profileSlug}/import-papers/citation`, {
          citation_string: importedContext,
        });
      } else if (importSource === IMPORT_SOURCE_TAB.AUTHOR_URLS) {
        rawRes = await axios.post(`/profiles/${profileSlug}/import-papers/author`, {
          author_ids: importedContext,
        });
      }
    } catch (err) {
      throw err;
    }

    if (!rawRes) throw new Error();

    const res = rawRes.data.data.content as ImportedPaperListResponse;

    const successPapersRes = {
      data: { content: res.successPapers, page: res.successPaperPage },
    } as PaginationResponseV2<Paper[]>;
    const successPapers = successPapersRes.data.content;
    const entity = normalize(successPapers, [paperSchema]);

    dispatch(ActionCreators.addEntity(entity));
    dispatch(
      getPapers({
        paperIds: entity.result,
        totalPages: successPapersRes.data.page!.totalPages,
        page: successPapersRes.data.page!.page,
        totalElements: successPapersRes.data.page!.totalElements,
      })
    );

    const pendingPapersRes = { data: { content: res.pendingPapers } } as PaginationResponseV2<PendingPaper[]>;
    const pendingPapers = pendingPapersRes.data.content;

    dispatch(getPendingPapers({ papers: pendingPapers }));
  };
}
