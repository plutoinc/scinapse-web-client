import React from 'react';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./pendingPaperItem.scss');

interface PendingPaperItemProps {
  paper: PendingPaper;
}

const PendingPaperItem: React.FC<PendingPaperItemProps> = ({ paper }) => {
  useStyles(s);

  return (
    <div className={s.pendingPaperItemWrapper}>
      <div className={s.pendingPaperItemTitle}>{paper.title}</div>
      <div className={s.pendingPaperItemVenueAndAuthor}>
        {`${paper.year} ・ ${paper.journal} | `}
        {paper.author}
      </div>
    </div>
  );
};

export default PendingPaperItem;
