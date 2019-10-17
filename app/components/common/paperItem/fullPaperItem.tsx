import React, { FC } from 'react';

import { Paper } from '../../../model/paper';
import Title from './title';
import Abstract from './abstract';
import BlockVenueAuthor from './blockVenueAuthor';
import PaperItemButtonGroup from './paperItemButtonGroup';
import { PaperSource } from '../../../api/paper';
import Figures from './figures';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./fullPaperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  sourceDomain?: PaperSource;
}

const FullPaperItem: FC<PaperItemProps> = React.memo(({ paper, actionArea, pageType, sourceDomain }) => {
  useStyles(s);
  return (
    <div className={s.paperItemWrapper}>
      <Title paper={paper} actionArea={actionArea} pageType={pageType} />
      <div style={{ marginTop: '12px' }}>
        <BlockVenueAuthor paper={paper} pageType={pageType} actionArea={actionArea} />
      </div>
      <Abstract
        paperId={paper.id}
        abstract={paper.abstractHighlighted || paper.abstract}
        pageType={pageType}
        actionArea={actionArea}
      />
      <Figures figures={paper.figures} paperId={paper.id} />
      <PaperItemButtonGroup
        paper={paper}
        pageType={pageType}
        actionArea={actionArea}
        paperSource={sourceDomain}
        saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
      />
    </div>
  );
});

export default FullPaperItem;
