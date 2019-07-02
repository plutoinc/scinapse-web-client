import React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
const styles = require('./knowledgeBaseNoti.scss');

interface KnowledgeBaseNotiProps {
  handleCloseDialogRequest: () => void;
}

const KnowledgeBaseNoti: React.FC<KnowledgeBaseNotiProps> = props => {
  const { handleCloseDialogRequest } = props;
  return (
    <div className={styles.notiContainer}>
      <div className={styles.notiTitle}>😊 Your research interest was analyzed</div>
      <div className={styles.notiBody}>
        <span className={styles.notiContent}>A list of recommended paper is prepared for you</span>
        <span className={styles.notiContent}>Do you want to check it?</span>
      </div>
      <div className={styles.notiBtnWrapper}>
        <a className={styles.letMeSeeBtn} href="/#recommended">
          Let me see
        </a>
        <button className={styles.noThxBtn} onClick={handleCloseDialogRequest} type="button">
          No thanks
        </button>
      </div>
    </div>
  );
};

export default withStyles<typeof KnowledgeBaseNoti>(styles)(KnowledgeBaseNoti);
