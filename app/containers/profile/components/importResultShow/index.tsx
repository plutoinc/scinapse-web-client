import React from 'react';
import { ImportedPaperListResponse } from '../../../../api/profile';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./importResultShow.scss');

const ImportResultShow: React.FC<{ importResult: ImportedPaperListResponse | null }> = ({ importResult }) => {
  useStyles(s);

  if (!importResult) return null;

  return (
    <div>
      <div className={s.header}>RESULT OF PAPER IMPORT</div>
      <div className={s.importResultSection}>
        <div className={s.successResultSection}>
          <Icon icon="CHECK" className={s.successIcon} />
          <div className={s.resultTitle}>SUCCESS</div>
          <div className={s.resultCount}>{importResult.successCount}</div>
        </div>
        <div className={s.pendingResultSection}>
          <Icon icon="ACTIVE_LINE" className={s.pendingIcon} />
          <div className={s.resultTitle}>PENDING</div>
          <div className={s.resultCount}>{importResult.pendingCount}</div>
        </div>
      </div>
    </div>
  );
};

export default ImportResultShow;
