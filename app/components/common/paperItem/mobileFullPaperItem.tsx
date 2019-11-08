import React, { FC, memo } from 'react';

import { Paper } from '../../../model/paper';
import { PaperSource } from '../../../api/paper';
import Title from './title';
import Abstract from './abstract';
import MobileVenueAuthors from './mobileVenueAuthors';
import PaperItemButtonGroup from './paperItemButtonGroup';
import { useObserver } from '../../../hooks/useIntersectionHook';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperItem.scss');

interface Props {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  sourceDomain?: PaperSource;
}

const MobileFullPaperItem: FC<Props> = memo(({ paper, pageType, actionArea, sourceDomain }) => {
  useStyles(s);
  const { elRef } = useObserver(0.8, {
    pageType,
    actionArea,
    actionType: 'view',
    actionTag: 'paperShow',
    actionLabel: String(paper.id),
  });

  return (
    <div ref={elRef} className={s.paperItemWrapper}>
      <Title paper={paper} actionArea={actionArea} pageType={pageType} />
      <MobileVenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} />
      <Abstract
        paperId={paper.id}
        abstract={paper.abstractHighlighted || paper.abstract}
        pageType={pageType}
        actionArea={actionArea}
      />
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

export default MobileFullPaperItem;
