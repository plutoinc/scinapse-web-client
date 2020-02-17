import React, { FC } from 'react';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';
import ResolvedPendingPaperDialogBody from '../resolvedPendingPaperDialogBody';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./resolvedPendingPaperDialog.scss');

interface ResolvedPendingPaperDialogProps {
  paper: PendingPaper;
  handleCloseDialog: () => void;
}

const ResolvedPendingPaperDialog: FC<ResolvedPendingPaperDialogProps> = ({ handleCloseDialog, paper }) => {
  useStyles(s);

  return (
    <div className={s.dialogPaper}>
      <div className={s.boxContainer}>
        <div className={s.boxWrapper}>
          <div style={{ marginTop: 0 }} className={s.header}>
            <div className={s.title}>Resolved Pending Paper</div>
            <Icon icon="X_BUTTON" className={s.iconWrapper} onClick={handleCloseDialog} />
          </div>
          <ResolvedPendingPaperDialogBody paper={paper} handleCloseDialog={handleCloseDialog} />
        </div>
      </div>
    </div>
  );
};

export default ResolvedPendingPaperDialog;
