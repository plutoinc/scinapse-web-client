import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import Icon from '../../../../icons';
import { AppState } from '../../../../reducers';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./importResultShow.scss');

const ImportResultShow: React.FC = () => {
  useStyles(s);
  const successPaperIds = useSelector<AppState, string[]>(state => state.profilePaperListState.paperIds, isEqual);
  const pendingPapers = useSelector<AppState, PendingPaper[]>(
    state => state.profilePendingPaperListState.papers,
    isEqual
  );

  return (
    <div>
      <div className={s.header}>RESULT OF PAPER IMPORT</div>
      <div className={s.importResultSection}>
        <div className={s.successResultSection}>
          <Icon icon="CHECK" className={s.successIcon} />
          <div className={s.resultTitle}>SUCCESS</div>
          <div className={s.resultCount}>{successPaperIds.length}</div>
        </div>
        <div className={s.pendingResultSection}>
          <Icon icon="ACTIVE_LINE" className={s.pendingIcon} />
          <div className={s.resultTitle}>PENDING</div>
          <div className={s.resultCount}>{pendingPapers.length}</div>
        </div>
      </div>
    </div>
  );
};

export default ImportResultShow;
