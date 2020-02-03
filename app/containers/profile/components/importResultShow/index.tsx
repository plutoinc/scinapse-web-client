import React from 'react';
import { PaperImportResType } from '../../../../api/profile';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./importResultShow.scss');

const ImportResultShow: React.FC<{ importResult: PaperImportResType | null }> = ({ importResult }) => {
  useStyles(s);

  if (!importResult) return null;

  return (
    <div>
      <div className={s.header}>RESULT OF PAPER IMPORT</div>
      <div className={s.importResultSection}>
        <div className={s.successResultSection}>
          <Icon icon="CHECK" className={s.resultIcon} />
          <div>SUCCESS</div>
          <div>{importResult.successCount}</div>
        </div>
        <div className={s.pendingResultSection}>
          <Icon icon="ACTIVE_LINE" className={s.resultIcon} />
          <div>PENDING</div>
          <div>{importResult.pendingCount}</div>
        </div>
      </div>
    </div>
  );
};

export default ImportResultShow;
