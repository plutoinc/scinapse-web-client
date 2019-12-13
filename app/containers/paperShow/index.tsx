import React, { FC, useEffect, useRef } from 'react';
import Axios from 'axios';
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
  const lastPaperId = useRef('');

  const paper = useSelector((state: AppState) => getMemoizedPaper(state), isEqual);
  const isMobile = useSelector((state: AppState) => state.layout.userDevice === UserDevice.MOBILE);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);
  const matchedPaperId = match.params.paperId;
  const paperId = paper && paper.id;

  useEffect(
    () => {
      if (paperId && paperId !== lastPaperId.current) {
        ActionTicketManager.trackTicket({
          pageType: 'paperShow',
          actionType: 'view',
          actionArea: '200',
          actionTag: 'pageView',
          actionLabel: String(paperId),
        });

        restoreScroll(location.key);
      }
    },
    [paperId, location.key]
  );

  useEffect(
    () => {
      const cancelToken = Axios.CancelToken.source();
      // NOTE: prevent fetching from the change of shouldFetch variable
      if (shouldFetch && !lastShouldFetch.current) {
        lastShouldFetch.current = true;
        return;
      }
      // NOTE: prevent double fetching
      if (!shouldFetch) return;

      const promise = dispatch(
        fetchPaperShowDataAtClient({
          paperId: matchedPaperId,
          cancelToken: cancelToken.token,
        })
      );

      Promise.all([promise])
        .then(() => {
          lastPaperId.current = matchedPaperId;
        })
        .catch(err => {
          console.error(err);
          ActionTicketManager.trackTicket({
            pageType: 'paperShow',
            actionType: 'view',
            actionArea: String(err.status),
            actionTag: 'pageView',
            actionLabel: String(matchedPaperId),
          });
          history.push(`/${err.status}`);
        });

      return () => {
        cancelToken.cancel();
      };
    },
    [location.pathname, currentUser.isLoggedIn, dispatch, matchedPaperId, shouldFetch, history]
  );

  if (!paper) return null;

  if (isMobile) {
    return <MobilePaperShow paper={paper} />;
  }

  return <PaperShow />;
};

export default withRouter(PaperShowContainer);
