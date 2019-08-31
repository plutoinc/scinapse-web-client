import React from 'react';
import { Paper } from '../../../model/paper';
import CitationListLinkButton from './citationListLinkButton';
import SourceButton from './sourceButton';
import CiteButton from './citeButton';
import CollectionButton from './collectionButton';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperSource } from '../../../api/paper';
import MoreDropdownButton from './moreDropdownButton';
const s = require('./paperItemButtonGroup.scss');

interface PaperItemButtonGroupProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
  saved?: boolean;
  dropdownContents?: React.ReactElement[];
}

const PaperItemButtonGroup: React.FC<PaperItemButtonGroupProps> = ({
  paper,
  pageType,
  actionArea,
  paperSource,
  saved,
  dropdownContents,
}) => {
  return (
    <div className={s.groupWrapper}>
      <div className={s.buttonListBox}>
        <CitationListLinkButton paper={paper} pageType={pageType} actionArea={actionArea} />
        <SourceButton paperId={paper.id} pageType={pageType} actionArea={actionArea} paperSource={paperSource} />
        <MoreDropdownButton dropdownContents={dropdownContents} paper={paper} />
      </div>
      <div className={s.buttonListBox}>
        <div className={s.buttonWrapper}>
          <CiteButton paper={paper} pageType={pageType} actionArea={actionArea} />
        </div>
        <div className={s.buttonWrapper}>
          <CollectionButton paper={paper} saved={!!saved} pageType={pageType} actionArea={actionArea} />
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof PaperItemButtonGroup>(s)(PaperItemButtonGroup);
