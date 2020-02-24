import { Dispatch } from 'redux';
import { normalize } from 'normalizr';
import { ThunkAction } from 'redux-thunk';
import Axios, { CancelToken } from 'axios';
import { ActionCreators } from './actionTypes';
import CollectionAPI, { PostCollectionParams } from '../api/collection';
import { GetPaperParams } from '../api/paper';
import { GetRefOrCitedPapersParams } from '../api/types/paper';
import alertToast from '../helpers/makePlutoToastAction';
import PlutoAxios from '../api/pluto';
import { CommonError } from '../model/error';
import { getRelatedPapers } from './relatedPapers';
import { logException } from '../helpers/errorHandler';
import { AppState } from '../reducers';
import { AppThunkAction } from '../store/types';
import { Paper, paperSchema } from '../model/paper';
import { getIdSafePaper, getSafeCollection } from '../helpers/getIdSafeData';
import { collectionSchema } from '../model/collection';

export function getMyCollections(paperId: string, cancelToken?: CancelToken, isOpenDropdown?: boolean): AppThunkAction {
  return async (dispatch, getState, { axios }) => {
    if (!getState().currentUser.isLoggedIn) return;

    try {
      if (isOpenDropdown) {
        dispatch(ActionCreators.startToGetCollectionsInPaperShowDropdown());
      } else {
        dispatch(ActionCreators.startToGetCollectionsInPaperShow());
      }

      const res = await axios.get(`/members/me/collections`, {
        params: {
          paper_id: String(paperId),
        },
        cancelToken,
      });
      const data = res.data.data;
      const collections = res.data.data.content.map(getSafeCollection);
      const normalizedCollections = normalize(collections, [collectionSchema]);
      const myCollections = { ...data, ...normalizedCollections };

      dispatch(ActionCreators.addEntity(myCollections));
      dispatch(ActionCreators.succeededToGetCollectionsInPaperShow(myCollections));
    } catch (err) {
      if (!Axios.isCancel(err)) {
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

export function getPaper(params: GetPaperParams): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    try {
      dispatch(ActionCreators.startToGetPaper());
      const res = await axios.get(`/papers/${params.paperId}`, {
        cancelToken: params.cancelToken,
      });
      const paper: Paper = getIdSafePaper(res.data);
      const paperResponse = normalize(paper, paperSchema);

      dispatch(ActionCreators.addEntity(paperResponse));
      dispatch(ActionCreators.getPaper({ paperId: paperResponse.result }));
    } catch (err) {
      if (!Axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);
        dispatch(ActionCreators.failedToGetPaper({ statusCode: (error as CommonError).status }));
        throw err;
      }
    }
  };
}

export function getReferencePapers({ paperId, size, page, query, sort }: GetRefOrCitedPapersParams): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    dispatch(ActionCreators.startToGetReferencePapers());
    const getReferencePapersResponse = await axios.get(`/search/references`, {
      params: {
        pid: String(paperId),
        size,
        page: page - 1,
        q: query,
        sort,
      },
    });
    const res = getReferencePapersResponse.data.data;
    const papers: Paper[] = res.content.map(getIdSafePaper);
    const normalizedPapersData = normalize(papers, [paperSchema]);

    dispatch(ActionCreators.addEntity(normalizedPapersData));
    dispatch(
      ActionCreators.getReferencePapers({
        ...res.page,
        paperIds: normalizedPapersData.result,
      })
    );
  };
}

export function getCitedPapers({ paperId, size, page, query, sort }: GetRefOrCitedPapersParams): AppThunkAction {
  return async (dispatch, _getState, { axios }) => {
    dispatch(ActionCreators.startToGetCitedPapers());
    const getCitedPapersResponse = await axios.get(`/search/citations`, {
      params: {
        pid: String(paperId),
        size,
        page: page - 1,
        q: query,
        sort,
      },
    });

    const res = getCitedPapersResponse.data.data;
    const papers: Paper[] = res.content.map(getIdSafePaper);
    const normalizedPapersData = normalize(papers, [paperSchema]);

    dispatch(ActionCreators.addEntity(normalizedPapersData));
    dispatch(
      ActionCreators.getCitedPapers({
        ...res.page,
        paperIds: normalizedPapersData.result,
      })
    );
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

interface FetchMobilePaperShowData {
  paperId: string;
  cancelToken: CancelToken;
}

export const fetchPaperShowDataAtClient = ({
  paperId,
  cancelToken,
}: FetchMobilePaperShowData): ThunkAction<Promise<void>, AppState, {}, any> => {
  return async (dispatch: Dispatch<any>) => {
    const promiseArray = [];

    promiseArray.push(dispatch(getPaper({ paperId, cancelToken })));
    promiseArray.push(dispatch(getRelatedPapers(paperId, cancelToken)));
    promiseArray.push(dispatch(getMyCollections(paperId, cancelToken)));

    try {
      await Promise.all(promiseArray);
    } catch (err) {
      if (!Axios.isCancel(err)) {
        logException(err);
        const error = PlutoAxios.getGlobalError(err);
        throw error;
      }
    }
  };
};
