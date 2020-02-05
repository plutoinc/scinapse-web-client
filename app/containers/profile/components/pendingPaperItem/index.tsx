import React from 'react';
import { PendingPaper } from '../../../../reducers/profilePendingPaperList';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./pendingPaperItem.scss');

interface PendingPaperItemProps {
  paper: PendingPaper;
}

const PendingPaperItem: React.FC<PendingPaperItemProps> = ({ paper }) => {
  useStyles(s);

  const yearNode = !paper.year ? '' : paper.year + ` ・ `;
  const journalNode = !paper.journal ? '' : paper.journal + ` | `;
  const authorsNode = !paper.author ? '' : paper.author;

  return (
    <div className={s.pendingPaperItemWrapper}>
      <div className={s.pendingPaperItemTitle}>{paper.title}</div>
      <div className={s.pendingPaperItemVenueAndAuthor}>
        {yearNode}
        {journalNode}
        {authorsNode}
      </div>
    </div>
  );
};

export default PendingPaperItem;
