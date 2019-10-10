import React, { FC, useEffect, useRef } from 'react';
import axios from 'axios';
import { isEqual } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { PaperShowMatchParams } from './types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../reducers';
import { UserDevice } from '../../components/layouts/reducer';
import MobilePaperShow from '../../components/mobilePaperShow/mobilePaperShow';
import PaperShow from '../../components/paperShow';
import { getMemoizedPaper } from './select';
import { fetchMobilePaperShowData } from '../../actions/paperShow';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { fetchCitedPaperData, fetchRefPaperData } from './sideEffect';

type Props = RouteComponentProps<PaperShowMatchParams>;

const PaperShowContainer: FC<Props> = ({ location, match }) => {
  const dispatch = useDispatch();
  const shouldPatch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const lastShouldPatch = useRef(shouldPatch);

  const paper = useSelector((state: AppState) => getMemoizedPaper(state));
  const isMobile = useSelector((state: AppState) => state.layout.userDevice === UserDevice.MOBILE);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);

  useEffect(
    () => {
      const cancelToken = axios.CancelToken.source();
      // NOTE: prevent patching from the change of shouldPatch variable
      if (shouldPatch && !lastShouldPatch.current) {
        lastShouldPatch.current = true;
        return;
      }
      // NOTE: prevent double patching
      if (!shouldPatch) return;

      dispatch(
        fetchMobilePaperShowData({
          paperId: parseInt(match.params.paperId, 10),
          isLoggedIn: currentUser.isLoggedIn,
          cancelToken: cancelToken.token,
        })
      );

      return () => {
        cancelToken.cancel();
      };
    },
    [location.pathname, currentUser.isLoggedIn, dispatch, match, shouldPatch]
  );

  const paperId = paper && paper.id;
  const queryParams = getQueryParamsObject(location.search);
  const refPage = queryParams['ref-page'] || 1;
  const refQuery = queryParams['ref-query'] || '';
  const refSort = queryParams['ref-sort'] || 'NEWEST_FIRST';
  const citedPage = queryParams['cited-page'] || 1;
  const citedQuery = queryParams['cited-query'] || '';
  const citedSort = queryParams['cited-sort'] || 'NEWEST_FIRST';
  React.useEffect(
    () => {
      if (!paperId) return;
      // NOTE: prevent patching from the change of shouldPatch variable
      if (shouldPatch && !lastShouldPatch.current) {
        lastShouldPatch.current = true;
        return;
      }
      // NOTE: prevent double patching
      if (!shouldPatch) return;

      const cancelToken = axios.CancelToken.source();
      dispatch(fetchRefPaperData(paperId, refPage, refQuery, refSort, cancelToken.token));

      return () => {
        cancelToken.cancel();
      };
    },
    [refPage, refQuery, refSort, dispatch, paperId, shouldPatch]
  );
  React.useEffect(
    () => {
      if (!paperId) return;
      // NOTE: prevent patching from the change of shouldPatch variable
      if (shouldPatch && !lastShouldPatch.current) {
        lastShouldPatch.current = true;
        return;
      }
      // NOTE: prevent double patching
      if (!shouldPatch) return;

      const cancelToken = axios.CancelToken.source();
      dispatch(fetchCitedPaperData(paperId, citedPage, citedQuery, citedSort, cancelToken.token));

      return () => {
        cancelToken.cancel();
      };
    },
    [citedPage, citedQuery, citedSort, dispatch, paperId, shouldPatch]
  );

  if (!paper) return null;

  if (isMobile) {
    return <MobilePaperShow paper={paper} />;
  }

  return <PaperShow />;
};

export default withRouter(PaperShowContainer);
