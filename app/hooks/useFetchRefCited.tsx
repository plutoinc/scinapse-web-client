import { useEffect, useRef } from 'react';
import Axios from 'axios';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { CurrentUser } from '../model/currentUser';
import { AppState } from '../reducers';
import { REF_CITED_CONTAINER_TYPE } from '../components/paperShow/constants';
import { fetchRefPaperData, fetchCitedPaperData } from '../containers/paperShow/sideEffect';
import { ActionCreators } from '../actions/actionTypes';
import { useThunkDispatch } from './useThunkDispatch';
import alertToast from '../helpers/makePlutoToastAction';
import { PAPER_LIST_SORT_TYPES } from '../components/common/sortBox';

interface UseFetchRefCitedPapersParams {
  type: REF_CITED_CONTAINER_TYPE;
  paperId: string;
  page: string | undefined;
  query: string;
  sort: PAPER_LIST_SORT_TYPES;
}

export function useFetchRefCitedPapers({ type, paperId, page = '1', query, sort }: UseFetchRefCitedPapersParams) {
  const shouldFetch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );

  const preventFetch = useRef(!shouldFetch);
  const currentUser: CurrentUser = useSelector((state: AppState) => state.currentUser, isEqual);
  const dispatch = useThunkDispatch();
  const fetchFunc = type === 'reference' ? fetchRefPaperData : fetchCitedPaperData;
  const failedActionCreator =
    type === 'reference' ? ActionCreators.failedToGetReferencePapers : ActionCreators.failedToGetCitedPapers;

  useEffect(() => {
    if (preventFetch.current) {
      preventFetch.current = false;
      return;
    };

    dispatch(fetchFunc(paperId, parseInt(page), query, sort))
      .catch(err => {
        if (!Axios.isCancel(err)) {
          alertToast({
            type: 'error',
            message: `Failed to get papers. ${err}`,
          });
          dispatch(failedActionCreator());
        }
      });
  }, [type, dispatch, paperId, page, query, sort, fetchFunc, failedActionCreator, currentUser.isLoggedIn]);
}
