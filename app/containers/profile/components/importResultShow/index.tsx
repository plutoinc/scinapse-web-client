import React from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../../icons';
import { AppState } from '../../../../reducers';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./importResultShow.scss');

const ImportResultShow: React.FC = () => {
  useStyles(s);

  const { successCount, pendingCount } = useSelector((state: AppState) => ({
    successCount: state.importPaperDialogState.successCount,
    pendingCount: state.importPaperDialogState.pendingCount,
  }));

  return (
    <div>
      <div className={s.header}>RESULT OF PAPER IMPORT</div>
      <div className={s.importResultSection}>
        <div className={s.successResultSection}>
          <Icon icon="CHECK" className={s.successIcon} />
          <div className={s.resultTitle}>SUCCESS</div>
          <div className={s.resultCount}>{successCount}</div>
        </div>
        <div className={s.pendingResultSection}>
          <Icon icon="ACTIVE_LINE" className={s.pendingIcon} />
          <div className={s.resultTitle}>PENDING</div>
          <div className={s.resultCount}>{pendingCount}</div>
        </div>
      </div>
    </div>
  );
};

export default ImportResultShow;
