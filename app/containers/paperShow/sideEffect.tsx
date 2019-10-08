import { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import { LoadDataParams } from '../../routes';
import {
  getPaper,
  getCitedPapers,
  getReferencePapers,
  fetchLastFullTextRequestedDate,
  getMyCollections,
} from '../../actions/paperShow';
import { CurrentUser } from '../../model/currentUser';
import { PaperShowMatchParams, PaperShowPageQueryParams } from './types';
import { ActionCreators } from '../../actions/actionTypes';
import { getRelatedPapers } from '../../actions/relatedPapers';

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

export async function fetchRefCitedPaperData(params: LoadDataParams<PaperShowMatchParams>) {
  const { dispatch, match, queryParams, cancelToken } = params;

  const paperId = parseInt(match.params.paperId, 10);
  const queryParamsObject: PaperShowPageQueryParams = queryParams ? queryParams : { 'cited-page': 1, 'ref-page': 1 };

  await Promise.all([
    dispatch(
      fetchCitedPaperData(
        paperId,
        queryParamsObject['cited-page'],
        queryParamsObject['cited-query'] || '',
        queryParamsObject['cited-sort'] || 'NEWEST_FIRST',
        cancelToken
      )
    ),
    dispatch(
      fetchRefPaperData(
        paperId,
        queryParamsObject['ref-page'],
        queryParamsObject['ref-query'] || '',
        queryParamsObject['ref-sort'] || 'NEWEST_FIRST',
        cancelToken
      )
    ),
  ]);
}

export async function fetchPaperShowData(params: LoadDataParams<PaperShowMatchParams>, currentUser?: CurrentUser) {
  const { dispatch, match } = params;
  const paperId = parseInt(match.params.paperId, 10);

  if (isNaN(paperId)) {
    return dispatch(ActionCreators.failedToGetPaper({ statusCode: 400 }));
  }

  const promiseArray = [];
  promiseArray.push(dispatch(getPaper({ paperId, cancelToken: params.cancelToken })));
  promiseArray.push(dispatch(getRelatedPapers(paperId, params.cancelToken)));

  if (currentUser && currentUser.isLoggedIn) {
    promiseArray.push(dispatch(fetchLastFullTextRequestedDate(paperId)));
    promiseArray.push(dispatch(getMyCollections(paperId, params.cancelToken)));
  }

  await Promise.all(promiseArray);
}
