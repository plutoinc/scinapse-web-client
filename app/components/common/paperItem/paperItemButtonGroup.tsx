import React from 'react';
import { Paper } from '../../../model/paper';
import CitationListLinkButton from './citationListLinkButton';
import SourceButton from './sourceButton';
import CiteButton from './citeButton';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperSource } from '../../../api/paper';
const s = require('./paperItemButtonGroup.scss');

interface PaperItemButtonGroupProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
}

const PaperItemButtonGroup: React.FC<PaperItemButtonGroupProps> = ({ paper, pageType, actionArea, paperSource }) => {
  return (
    <>
      <CitationListLinkButton paper={paper} pageType={pageType} actionArea={actionArea} />
      <SourceButton paperId={paper.id} pageType={pageType} actionArea={actionArea} paperSource={paperSource} />
      <CiteButton paper={paper} pageType={pageType} actionArea={actionArea} />
    </>
  );
};

export default withStyles<typeof PaperItemButtonGroup>(s)(PaperItemButtonGroup);
