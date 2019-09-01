import * as React from 'react';
import Title from './title';
import Abstract from './abstract';
import { Paper } from '../../../model/paper';
import VenueAuthors, { VenueAuthorType } from './venueAuthors';

interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  venueAuthorType?: VenueAuthorType;
  omitAbstract?: boolean;
}

const PaperItem: React.FC<PaperItemProps> = React.memo(
  ({ paper, actionArea, pageType, omitAbstract, venueAuthorType }) => {
    return (
      <>
        <Title paper={paper} actionArea={actionArea} pageType={pageType} />
        <VenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} venueAuthorType={venueAuthorType} />
        {!omitAbstract && (
          <Abstract
            paperId={paper.id}
            abstract={paper.abstractHighlighted || paper.abstract}
            pageType={pageType}
            actionArea={actionArea}
          />
        )}
      </>
    );
  }
);

export default PaperItem;
