import React from 'react';
import Title from './title';
import { Paper } from '../../../model/paper';

type AuthorVenueType = 'block' | 'line';

interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  authorVenueType?: AuthorVenueType;
  omitAbstract?: boolean;
}

const PaperItem: React.FC<PaperItemProps> = React.memo(({ paper, actionArea, pageType }) => {
  return (
    <>
      <Title paper={paper} actionArea={actionArea} pageType={pageType} />
    </>
  );
});
