import React from 'react';
import Title from './title';
import Abstract from './abstract';
import { Paper } from '../../../model/paper';

type AuthorVenueType = 'block' | 'line';

interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  authorVenueType?: AuthorVenueType;
  omitAbstract?: boolean;
}

const PaperItem: React.FC<PaperItemProps> = React.memo(({ paper, actionArea, pageType, omitAbstract }) => {
  return (
    <>
      <Title paper={paper} actionArea={actionArea} pageType={pageType} />
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
});
