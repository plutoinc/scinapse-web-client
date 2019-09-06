import * as React from 'react';
import BlockVenue from './blockVenue';
import BlockAuthorList from './blockAuthorList';
import { Paper } from '../../../model/paper';

interface BlockVenueAuthorProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const BlockVenueAuthor: React.FC<BlockVenueAuthorProps> = ({ paper, pageType, actionArea }) => {
  return (
    <>
      <BlockVenue
        journal={paper.journal}
        conferenceInstance={paper.conferenceInstance}
        publishedDate={paper.publishedDate}
        pageType={pageType}
        actionArea={actionArea}
      />
      <BlockAuthorList paper={paper} authors={paper.authors} pageType={pageType} actionArea={actionArea} />
    </>
  );
};

export default BlockVenueAuthor;
