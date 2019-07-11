import { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import { LoadDataParams } from '../../routes';
import { getPaper, getCitedPapers, getReferencePapers, getMyCollections } from '../../actions/paperShow';
import { CurrentUser } from '../../model/currentUser';
import { PaperShowMatchParams } from './types';
import { ActionCreators } from '../../actions/actionTypes';

export function fetchMyCollection(paperId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(getMyCollections(paperId, cancelToken));
  };
}

export function fetchCitedPaperData(
  paperId: number,
  page: number = 1,
  query: string,
  sort: string | null,
  cancelToken: CancelToken
) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getCitedPapers({
        paperId,
        page,
        query,
        sort,
        cancelToken,
      })
    );
  };
}

export function fetchRefPaperData(
  paperId: number,
  page: number = 1,
  query: string,
  sort: string | null,
  cancelToken: CancelToken
) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getReferencePapers({
        paperId,
        page,
        query,
        sort,
        cancelToken,
      })
    );
  };
}

export async function fetchPaperShowData(params: LoadDataParams<PaperShowMatchParams>, currentUser?: CurrentUser) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);

  if (isNaN(paperId)) {
    return dispatch(ActionCreators.failedToGetPaper({ statusCode: 400 }));
  }

  const promiseArray = [];
  promiseArray.push(dispatch(getPaper({ paperId, cancelToken: params.cancelToken })));

  if (currentUser && currentUser.isLoggedIn) {
    promiseArray.push(dispatch(fetchMyCollection(paperId, params.cancelToken)));
  }

  await Promise.all(promiseArray);
}
