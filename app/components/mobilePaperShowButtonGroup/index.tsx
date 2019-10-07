import React, { FC } from 'react';
import { Paper } from '../../model/paper';
import { PaperSource } from '../../api/paper';
import SourceButton from '../common/paperItem/sourceButton';
import CiteButton from '../common/paperItem/citeButton';
import CollectionButton from '../common/paperItem/collectionButton';

interface Props {
  paper: Paper;
  saved: boolean;
  className: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
}

const MobilePaperShowButtonGroup: FC<Props> = ({ paper, pageType, actionArea, paperSource, saved, className }) => {
  return (
    <div className={className}>
      <CiteButton paper={paper} pageType={pageType} actionArea={actionArea} />
      <SourceButton paper={paper} pageType={pageType} actionArea={actionArea} paperSource={paperSource} />
      <CollectionButton paper={paper} saved={!!saved} pageType={pageType} actionArea={actionArea} />
    </div>
  );
};

export default MobilePaperShowButtonGroup;
