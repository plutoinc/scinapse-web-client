import React, { FC, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import { REF_CITED_CONTAINER_TYPE } from '../../components/paperShow/constants';
import { PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import { fetchRefPaperData, fetchCitedPaperData } from '../paperShow/sideEffect';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import alertToast from '../../helpers/makePlutoToastAction';
import { ActionCreators } from '../../actions/actionTypes';
import { useThunkDispatch } from '../../hooks/useThunkDispatch';

const s = require('./refCitedPapersContainer.scss');
const useStyles = require('isomorphic-style-loader/useStyles');
const NAVBAR_HEIGHT = parseInt(s.navbarHeight, 10);
const MOBILE_FIXED_HEADER_HEIGHT = parseInt(s.mobileFixedHeaderHeight, 10);

interface Props {
  type: REF_CITED_CONTAINER_TYPE;
  parentPaperId: string;
  page: number;
  query: string;
  sort: PAPER_LIST_SORT_TYPES;
}

const RefCitedPapersContainer: FC<Props> = ({ type, parentPaperId, page, query, sort, children }) => {
  useStyles(s);
  const dispatch = useThunkDispatch();

  const shouldFetch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const currentUser: CurrentUser | null = useSelector((state: AppState) => state.currentUser, isEqual);
  const isLoggedIn = currentUser && currentUser.isLoggedIn;

  const wrapperNode = useRef<HTMLDivElement>(null);
  const lastParentPaperId = useRef('');
  const lastPage = useRef(page);

  useEffect(
    () => {
      if (!shouldFetch) {
        lastParentPaperId.current = parentPaperId;
        lastPage.current = page;
        return;
      }

      if (lastParentPaperId.current === parentPaperId && lastPage.current === page) return;

      const fetchFunc = type === 'reference' ? fetchRefPaperData : fetchCitedPaperData;
      const failedActionCreator =
        type === 'reference' ? ActionCreators.failedToGetReferencePapers : ActionCreators.failedToGetCitedPapers;

      dispatch(fetchFunc(parentPaperId, page, query, sort))
        .then(() => {
          if (wrapperNode.current && lastParentPaperId.current === parentPaperId && lastPage.current !== page) {
            window.scrollTo(0, wrapperNode.current.offsetTop - NAVBAR_HEIGHT - MOBILE_FIXED_HEADER_HEIGHT);
          }
          lastParentPaperId.current = parentPaperId;
          lastPage.current = page;
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
    [page, query, sort, type, parentPaperId, dispatch, shouldFetch, isLoggedIn]
  );

  return <div ref={wrapperNode}>{children}</div>;
};

export default RefCitedPapersContainer;
