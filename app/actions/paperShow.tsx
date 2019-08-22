import { Dispatch } from 'redux';
import axios, { CancelToken } from 'axios';
import { ActionCreators } from './actionTypes';
import MemberAPI from '../api/member';
import CollectionAPI, { PostCollectionParams } from '../api/collection';
import PaperAPI, { GetPaperParams } from '../api/paper';
import { GetRefOrCitedPapersParams } from '../api/types/paper';
import alertToast from '../helpers/makePlutoToastAction';
import PlutoAxios from '../api/pluto';
import { CommonError } from '../model/error';

export function clearPaperShowState() {
  return ActionCreators.clearPaperShowState();
}

export function getMyCollections(paperId: number, cancelToken: CancelToken, isOpenDropdown?: boolean) {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (isOpenDropdown) {
        dispatch(ActionCreators.startToGetCollectionsInPaperShowDropdown());
      } else {
        dispatch(ActionCreators.startToGetCollectionsInPaperShow());
      }
      const res = await MemberAPI.getMyCollections(paperId, cancelToken);
      dispatch(ActionCreators.addEntity(res));
      dispatch(ActionCreators.succeededToGetCollectionsInPaperShow(res));
      return res;
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch(ActionCreators.failedToGetCollectionsInPaperShow());
        const error = PlutoAxios.getGlobalError(err);
        if (error) {
          alertToast({
            type: 'error',
            message: error.message,
          });
        }
      }
    }
  };
}

export function getPaper(params: GetPaperParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetPaper());
      const paperResponse = await PaperAPI.getPaper(params);
      dispatch(ActionCreators.addEntity(paperResponse));
      dispatch(ActionCreators.getPaper({ paperId: paperResponse.result }));
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);
        dispatch(ActionCreators.failedToGetPaper({ statusCode: (error as CommonError).status }));
        throw err;
      }
    }
  };
}

export function getReferencePapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetReferencePapers());

    try {
      const getPapersResult = await PaperAPI.getReferencePapers(params);
      dispatch(ActionCreators.addEntity(getPapersResult));
      dispatch(
        ActionCreators.getReferencePapers({
          paperIds: getPapersResult.result,
          size: getPapersResult.size,
          page: getPapersResult.page,
          first: getPapersResult.first,
          last: getPapersResult.last,
          numberOfElements: getPapersResult.numberOfElements,
          totalPages: getPapersResult.totalPages,
          totalElements: getPapersResult.totalElements,
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: 'error',
          message: `Failed to get papers. ${err}`,
        });
        dispatch(ActionCreators.failedToGetReferencePapers());
      }
    }
  };
}

export function getCitedPapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetCitedPapers());

    try {
      const getPapersResult = await PaperAPI.getCitedPapers(params);
      dispatch(ActionCreators.addEntity(getPapersResult));
      dispatch(
        ActionCreators.getCitedPapers({
          paperIds: getPapersResult.result,
          size: getPapersResult.size,
          page: getPapersResult.page,
          first: getPapersResult.first,
          last: getPapersResult.last,
          numberOfElements: getPapersResult.numberOfElements,
          totalPages: getPapersResult.totalPages,
          totalElements: getPapersResult.totalElements,
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: 'error',
          message: `Failed to get papers. ${err}`,
        });
      }
    }
  };
}

export function postNewCollection(params: PostCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostCollectionInCollectionDropdown());

      const res = await CollectionAPI.postCollection(params);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToPostCollectionInCollectionDropdown({
          collectionId: res.result,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToPostCollectionInCollectionDropdown());
      throw err;
    }
  };
}

export function fetchLastFullTextRequestedDate(paperId: number) {
  return async (dispatch: Dispatch<any>) => {
    let requestedAt;
    try {
      const res = await PaperAPI.getLastRequestDate(paperId);

      if (res) {
        requestedAt = res.requestedAt;
      } else {
        requestedAt = null;
      }

      dispatch(ActionCreators.fetchLastFullTextRequestedDate({ requestedAt }));
    } catch (err) {
      console.error(err);
    }
  };
}

export function openCollectionDropdown() {
  return ActionCreators.openCollectionDropdownInPaperShowCollectionDropdown();
}

export function closeCollectionDropdown() {
  return ActionCreators.closeCollectionDropdownInPaperShowCollectionDropdown();
}

export function openNoteDropdown() {
  return ActionCreators.openNoteDropdownInPaperShow();
}

export function closeNoteDropdown() {
  return ActionCreators.closeNoteDropdownInPaperShow();
}
