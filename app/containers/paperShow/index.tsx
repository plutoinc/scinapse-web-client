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
import { fetchPaperShowDataAtClient } from '../../actions/paperShow';
import ActionTicketManager from '../../helpers/actionTicketManager';
import restoreScroll from '../../helpers/scrollRestoration';

type Props = RouteComponentProps<PaperShowMatchParams>;

const PaperShowContainer: FC<Props> = ({ location, match, history }) => {
  const dispatch = useDispatch();
  const shouldFetch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );
  const lastShouldFetch = useRef(shouldFetch);
  const lastPaperId = useRef(0);

  const paper = useSelector((state: AppState) => getMemoizedPaper(state), isEqual);
  const isMobile = useSelector((state: AppState) => state.layout.userDevice === UserDevice.MOBILE);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);

  useEffect(
    () => {
      const cancelToken = axios.CancelToken.source();
      // NOTE: prevent fetching from the change of shouldFetch variable
      if (shouldFetch && !lastShouldFetch.current) {
        lastShouldFetch.current = true;
        return;
      }
      // NOTE: prevent double fetching
      if (!shouldFetch) return;

      const paperId = parseInt(match.params.paperId);
      if (paperId === lastPaperId.current) return;

      const promise = dispatch(
        fetchPaperShowDataAtClient({
          paperId,
          isLoggedIn: currentUser.isLoggedIn,
          cancelToken: cancelToken.token,
        })
      );

      Promise.all([promise])
        .then(() => {
          ActionTicketManager.trackTicket({
            pageType: 'paperShow',
            actionType: 'view',
            actionArea: '200',
            actionTag: 'pageView',
            actionLabel: String(paperId),
          });
          lastPaperId.current = paperId;
          restoreScroll(location.key);
        })
        .catch(err => {
          ActionTicketManager.trackTicket({
            pageType: 'paperShow',
            actionType: 'view',
            actionArea: String(err.status),
            actionTag: 'pageView',
            actionLabel: String(paperId),
          });
          history.push(`/${err.status}`);
        });

      return () => {
        cancelToken.cancel();
      };
    },
    [location, currentUser.isLoggedIn, dispatch, match, shouldFetch, history]
  );

  if (!paper) return null;

  if (isMobile) {
    return <MobilePaperShow paper={paper} />;
  }

  return <PaperShow />;
};

export default withRouter(PaperShowContainer);
