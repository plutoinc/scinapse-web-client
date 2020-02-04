import React, { useState } from 'react';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';
import PendingPapersDialog from '../pendingPapersDialog';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./pendingPaperList.scss');

interface PendingPaperListProps {
  papers: PendingPaper[];
}

const PendingPaperList: React.FC<PendingPaperListProps> = props => {
  useStyles(s);
  const { papers } = props;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  if (papers.length === 0) return null;

  return (
    <>
      <PendingPapersDialog papers={papers} isOpen={isDialogOpen} handleClose={() => setIsDialogOpen(false)} />
      <div className={s.description}>
        what 'pending' means?<br />
        'pending' is blablabla<br />
        If you want see your pending paper,{` `}
        <span className={s.highlightKeyword} onClick={() => setIsDialogOpen(true)}>
          CLICK HERE!
        </span>
      </div>
    </>
  );
};

export default PendingPaperList;
