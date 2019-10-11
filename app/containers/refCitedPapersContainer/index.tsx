import React, { FC, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import { REF_CITED_CONTAINER_TYPE } from '../../components/paperShow/constants';
import { PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import { fetchRefPaperData, fetchCitedPaperData } from '../paperShow/sideEffect';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import alertToast from '../../helpers/makePlutoToastAction';
import { ActionCreators } from '../../actions/actionTypes';

interface Props {
  type: REF_CITED_CONTAINER_TYPE;
  parentPaperId: number;
  page: number;
  query: string;
  sort: PAPER_LIST_SORT_TYPES;
}

const RefCitedPapersContainer: FC<Props> = ({ type, parentPaperId, page, query, sort, children }) => {
  const dispatch = useDispatch();

  const shouldPatch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const currentUser: CurrentUser | null = useSelector((state: AppState) => state.currentUser, isEqual);
  const isLoggedIn = currentUser && currentUser.isLoggedIn;

  const lastParentPaperId = useRef(parentPaperId);
  const lastPage = useRef(page);
  const lastQuery = useRef(query);
  const lastSort = useRef(sort);
  const lastShouldPatch = useRef(shouldPatch);
  const lastIsLoggedIn = useRef(isLoggedIn);

  useEffect(
    () => {
      // NOTE: prevent fetching from the change of shouldPatch variable
      if (shouldPatch && !lastShouldPatch.current) {
        lastShouldPatch.current = true;
        return;
      }
      // NOTE: prevent double fetching
      if (!shouldPatch) return;
      // NOTE: prevent unneeded fetching
      if (
        lastParentPaperId.current === parentPaperId &&
        lastPage.current === page &&
        lastQuery.current === query &&
        lastSort.current === sort &&
        lastIsLoggedIn.current === isLoggedIn
      ) {
        return;
      }

      const fetchFunc = type === 'reference' ? fetchRefPaperData : fetchCitedPaperData;
      const failedActionCreator =
        type === 'reference' ? ActionCreators.failedToGetReferencePapers : ActionCreators.failedToGetCitedPapers;
      const promise = dispatch(fetchFunc(parentPaperId, page, query, sort));

      Promise.all([promise])
        .then(() => {
          lastParentPaperId.current = parentPaperId;
          lastPage.current = page;
          lastQuery.current = query;
          lastSort.current = sort;
          lastIsLoggedIn.current = isLoggedIn;
        })
        .catch(err => {
          if (!axios.isCancel(err)) {
            alertToast({
              type: 'error',
              message: `Failed to get papers. ${err}`,
            });
            dispatch(failedActionCreator());
          }
        });
    },
    [page, query, sort, type, parentPaperId, dispatch, shouldPatch, isLoggedIn]
  );

  return <>{children}</>;
};

export default RefCitedPapersContainer;
