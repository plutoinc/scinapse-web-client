import React from 'react';
import * as Cookies from 'js-cookie';
import { withStyles } from '../../helpers/withStylesHelper';
import Dialog from '@material-ui/core/Dialog';
import { AppState } from '../../reducers';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionCreators } from '../../actions/actionTypes';
import { BASED_ACTIVITY_COUNT_COOKIE_KEY } from '../../helpers/basedOnRecommendationActivityManager';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
const styles = require('./knowledgeBaseNoti.scss');

type Props = ReturnType<typeof mapStateToProps> & { dispatch: Dispatch<any> };

function clickLetMeSeeBtn() {
  Cookies.set(BASED_ACTIVITY_COUNT_COOKIE_KEY, 'null');
  ActionTicketManager.trackTicket({
    pageType: getCurrentPageType(),
    actionType: 'fire',
    actionArea: 'knowledgeBaseNoti',
    actionTag: 'clickLetMeSeeBtn',
    actionLabel: 'null',
  });
}

const KnowledgeBaseNoti: React.FC<Props> = props => {
  const { knowledgeBaseNotiState, dispatch } = props;
  const { isOpen } = knowledgeBaseNotiState;

  React.useEffect(
    () => {
      if (isOpen) {
        ActionTicketManager.trackTicket({
          pageType: getCurrentPageType(),
          actionType: 'view',
          actionArea: 'knowledgeBaseNoti',
          actionTag: 'viewKnowledgeBaseNoti',
          actionLabel: 'null',
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
        <a className={styles.letMeSeeBtn} href="/#recommended" onClick={clickLetMeSeeBtn}>
          Let me see
        </a>
        <button
          className={styles.noThxBtn}
          onClick={() => {
            dispatch(ActionCreators.closeKnowledgeBaseNoti());
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'knowledgeBaseNoti',
              actionTag: 'clickNoThxBtn',
              actionLabel: 'null',
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
    knowledgeBaseNotiState: state.knowledgeBaseNotiState,
  };
};

export default connect(mapStateToProps)(withStyles<typeof KnowledgeBaseNoti>(styles)(KnowledgeBaseNoti));
