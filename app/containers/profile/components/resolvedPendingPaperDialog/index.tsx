import React, { FC } from 'react';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./resolvedPendingPaperDialog.scss');

interface ResolvedPendingPaperDialogProps {
  handleCloseDialog: () => void;
  paper: PendingPaper;
}

const ResolvedPendingPaperDialog: FC<ResolvedPendingPaperDialogProps> = ({}) => {
  useStyles(s);

  return <div />;
};

export default ResolvedPendingPaperDialog;
