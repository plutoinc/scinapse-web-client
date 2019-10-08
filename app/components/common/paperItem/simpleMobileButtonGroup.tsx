import React, { FC } from 'react';
import { Paper } from '../../../model/paper';
import MobileCitationListLinkButton from './mobileCitationListLinkButton';
import MobileReadLaterButton from './mobileReadLaterButton';
const s = require('./simpleMobileButtonGroup.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

interface Props {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  saved: boolean;
}

const SimpleMobilePaperItemButtonGroup: FC<Props> = ({ paper, pageType, actionArea, saved }) => {
  useStyles(s);

  return (
    <div className={s.groupWrapper}>
      <div>
        <MobileCitationListLinkButton
          paperId={paper.id}
          citedCount={paper.citedCount}
          pageType={pageType}
          actionArea={actionArea}
        />
      </div>
      <div>
        <MobileReadLaterButton paperId={paper.id} saved={!!saved} pageType={pageType} actionArea={actionArea} />
      </div>
    </div>
  );
};

export default SimpleMobilePaperItemButtonGroup;
