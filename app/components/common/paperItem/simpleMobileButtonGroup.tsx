import React, { FC } from 'react';
import { Paper } from '../../../model/paper';
import CitationListLinkButton from './citationListLinkButton';
import CollectionButton from './collectionButton';
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
        <CitationListLinkButton className={s.citationLink} paper={paper} pageType={pageType} actionArea={actionArea} />
      </div>
      <div>
        <CollectionButton paper={paper} saved={!!saved} pageType={pageType} actionArea={actionArea} />
      </div>
    </div>
  );
};

export default SimpleMobilePaperItemButtonGroup;
