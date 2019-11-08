import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';

import { Paper } from '../../../model/paper';
import Title from './title';
import Abstract from './abstract';
import BlockVenueAuthor from './blockVenueAuthor';
import PaperItemButtonGroup from './paperItemButtonGroup';
import { PaperSource } from '../../../api/paper';
import Figures from './figures';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/reducer';
import MobileFullPaperItem from './mobileFullPaperItem';
import { useObserver } from '../../../hooks/useIntersectionHook';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperItem.scss');

interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  sourceDomain?: PaperSource;
}

const FullPaperItem: FC<PaperItemProps> = memo(({ paper, actionArea, pageType, sourceDomain }) => {
  useStyles(s);
  const { elRef } = useObserver(0.8, {
    pageType,
    actionArea,
    actionType: 'view',
    actionTag: 'paperShow',
    actionLabel: String(paper.id),
  });

  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  if (userDevice === UserDevice.MOBILE) {
    return (
      <MobileFullPaperItem paper={paper} actionArea={actionArea} pageType={pageType} sourceDomain={sourceDomain} />
    );
  }

  return (
    <div ref={elRef} className={s.paperItemWrapper}>
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
