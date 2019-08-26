import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { Link } from 'react-router-dom';
import { withStyles } from '../../helpers/withStylesHelper';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
import { AppState } from '../../reducers';
import { ALREADY_VISITED_RECOMMEND_PAPERS, BASED_ACTIVITY_COUNT_STORE_KEY } from './recommendPoolConstants';
import { RecommendPoolState, closeRecommendPapersDialog } from './recommendPoolReducer';
const styles = require('./recommendPool.scss');
const store = require('store');

const RecommendPool: React.FC = () => {
  const dispatch = useDispatch();
  const dialogState = useSelector<AppState, RecommendPoolState>(state => state.recommendPoolState);
  const { isOpen, actionArea } = dialogState;

  function clickLetMeSeeBtn(actionArea: string) {
    store.set(BASED_ACTIVITY_COUNT_STORE_KEY, ALREADY_VISITED_RECOMMEND_PAPERS);
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: 'fire',
      actionArea: 'knowledgeBaseNoti',
      actionTag: 'clickLetMeSeeBtn',
      actionLabel: actionArea,
    });
    dispatch(closeRecommendPapersDialog());
  }

  return (
    <Dialog open={isOpen} classes={{ paper: styles.notiContainer }}>
      <div className={styles.notiTitle}>😊 Your research interest was analyzed</div>
      <div className={styles.notiBody}>
        <span className={styles.notiContent}>A list of recommended paper is prepared for you</span>
        <span className={styles.notiContent}>Do you want to check it?</span>
      </div>
      <div className={styles.notiBtnWrapper}>
        <Link className={styles.letMeSeeBtn} to="/#recommended" onClick={() => clickLetMeSeeBtn(actionArea)}>
          Let me see
        </Link>
        <button
          className={styles.noThxBtn}
          onClick={() => {
            dispatch(closeRecommendPapersDialog());
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'knowledgeBaseNoti',
              actionTag: 'clickNoThxBtn',
              actionLabel: actionArea,
            });
          }}
          type="button"
        >
          No thanks
        </button>
      </div>
    </Dialog>
  );
};

export default withStyles<typeof RecommendPool>(styles)(RecommendPool);
