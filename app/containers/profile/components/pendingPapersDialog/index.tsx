import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';
import PendingPaperItem from '../pendingPaperItem';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./pendingPapersDialog.scss');

interface PendingPApersDialogProps {
  papers: PendingPaper[];
  isOpen: boolean;
  handleClose: () => void;
}

const PendingPapersDialog: React.FC<PendingPApersDialogProps> = ({ papers, isOpen, handleClose }) => {
  useStyles(s);

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.title}>Pending Publication ( {papers.length} )</div>
      <div className={s.description}>대충 곧 매칭된다는 문구.</div>
      <div className={s.contentBox}>{papers.map(paper => <PendingPaperItem paper={paper} key={paper.id} />)}</div>
    </Dialog>
  );
};

export default PendingPapersDialog;
