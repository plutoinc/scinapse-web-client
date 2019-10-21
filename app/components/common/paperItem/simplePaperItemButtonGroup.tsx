import React, { FC } from 'react';
import { Paper } from '../../../model/paper';
import SimpleCitationListLinkButton from './simpleCitationListLinkButton';
import SimpleReadLaterButton from './simpleReadLaterButton';
const s = require('./simplePaperItemButtonGroup.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

interface Props {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  saved: boolean;
}

const SimplePaperItemButtonGroup: FC<Props> = ({ paper, pageType, actionArea, saved }) => {
  useStyles(s);

  return (
    <div className={s.groupWrapper}>
      <div>
        <SimpleCitationListLinkButton
          paperId={paper.id}
          citedCount={paper.citedCount}
          pageType={pageType}
          actionArea={actionArea}
        />
      </div>
      <div>
        <SimpleReadLaterButton paperId={paper.id} saved={!!saved} pageType={pageType} actionArea={actionArea} />
      </div>
    </div>
  );
};

export default SimplePaperItemButtonGroup;
