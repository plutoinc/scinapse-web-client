import * as React from 'react';
import BlockVenue from './blockVenue';
import BlockAuthorList from './blockAuthorList';
import { Paper } from '../../../model/paper';

interface BlockVenueAuthorProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  ownProfileSlug?: string;
}

const BlockVenueAuthor: React.FC<BlockVenueAuthorProps> = ({ paper, pageType, actionArea, ownProfileSlug }) => {
  return (
    <>
      <BlockVenue
        journal={paper.journal}
        conferenceInstance={paper.conferenceInstance}
        publishedDate={paper.publishedDate}
        year={paper.year}
        pageType={pageType}
        actionArea={actionArea}
      />
      <BlockAuthorList ownProfileSlug={ownProfileSlug} paper={paper} pageType={pageType} actionArea={actionArea} />
    </>
  );
};

export default BlockVenueAuthor;
