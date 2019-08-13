import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { AppState } from '../../reducers';
import { withStyles } from '../../helpers/withStylesHelper';
import { ActionCreators } from '../../actions/actionTypes';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
import { ALREADY_VISITED_RECOMMEND_PAPERS, BASED_ACTIVITY_COUNT_STORE_KEY } from './recommendPapersDialogConstants';
const styles = require('./recommendPapersDialog.scss');
const store = require('store');

type Props = ReturnType<typeof mapStateToProps> & { dispatch: Dispatch<any> };

function clickLetMeSeeBtn(actionArea: string) {
  store.set(BASED_ACTIVITY_COUNT_STORE_KEY, ALREADY_VISITED_RECOMMEND_PAPERS);
  ActionTicketManager.trackTicket({
    pageType: getCurrentPageType(),
    actionType: 'fire',
    actionArea: 'knowledgeBaseNoti',
    actionTag: 'clickLetMeSeeBtn',
    actionLabel: actionArea,
  });
}

const RecommendPapersDialog: React.FC<Props> = props => {
  const { recommendPapersDialogState, dispatch } = props;
  const { isOpen, actionArea } = recommendPapersDialogState;

  React.useEffect(
    () => {
      if (isOpen) {
        ActionTicketManager.trackTicket({
          pageType: getCurrentPageType(),
          actionType: 'view',
          actionArea: 'knowledgeBaseNoti',
          actionTag: 'viewKnowledgeBaseNoti',
          actionLabel: actionArea,
        });
      }
    },
    [isOpen]
  );

  return (
    <Dialog open={isOpen} classes={{ paper: styles.notiContainer }}>
      <div className={styles.notiTitle}>😊 Your research interest was analyzed</div>
      <div className={styles.notiBody}>
        <span className={styles.notiContent}>A list of recommended paper is prepared for you</span>
        <span className={styles.notiContent}>Do you want to check it?</span>
      </div>
      <div className={styles.notiBtnWrapper}>
        <a className={styles.letMeSeeBtn} href="/#recommended" onClick={() => clickLetMeSeeBtn(actionArea)}>
          Let me see
        </a>
        <button
          className={styles.noThxBtn}
          onClick={() => {
            dispatch(ActionCreators.closeRecommendPapersDialog());
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

const mapStateToProps = (state: AppState) => {
  return {
    recommendPapersDialogState: state.recommendPapersDialogState,
  };
};

export default connect(mapStateToProps)(withStyles<typeof RecommendPapersDialog>(styles)(RecommendPapersDialog));
