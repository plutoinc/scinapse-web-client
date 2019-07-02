import React from 'react';
import * as Cookies from 'js-cookie';
import { withStyles } from '../../helpers/withStylesHelper';
import Dialog from '@material-ui/core/Dialog';
import { AppState } from '../../reducers';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionCreators } from '../../actions/actionTypes';
import { BASED_ACTIVITY_COUNT_COOKIE_KEY } from '../../helpers/basedOnRecommendationActivityManager';
const styles = require('./knowledgeBaseNoti.scss');

type Props = ReturnType<typeof mapStateToProps> & { dispatch: Dispatch<any> };

function clickLetMeSeeBtn() {
  Cookies.set(BASED_ACTIVITY_COUNT_COOKIE_KEY, 'null');
}

const KnowledgeBaseNoti: React.FC<Props> = props => {
  const { knowledgeBaseNotiState, dispatch } = props;
  const { isOpen } = knowledgeBaseNotiState;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        dispatch(ActionCreators.closeKnowledgeBaseNoti());
      }}
      classes={{ paper: styles.notiContainer }}
    >
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
