import React from 'react';
import LineVenueAuthors from './lineVenueAuthors';
import { Paper } from '../../../model/paper';
import BlockVenueAuthor from './blockVenueAuthor';

export type VenueAuthorType = 'block' | 'line';

interface VenueAuthorsProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  venueAuthorType?: VenueAuthorType;
}

const VenueAuthors: React.FC<VenueAuthorsProps> = ({ venueAuthorType, paper, pageType, actionArea }) => {
  if (venueAuthorType === 'block') {
    return <BlockVenueAuthor paper={paper} pageType={pageType} actionArea={actionArea} />;
  }

  return <LineVenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} />;
};

export default VenueAuthors;
