import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import { isEqual } from 'lodash';
import { Paper, paperSchema } from '../../../model/paper';
import Title from './title';
import Abstract from './abstract';
import BlockVenueAuthor from './blockVenueAuthor';
import PaperItemButtonGroup from './paperItemButtonGroup';
import { PaperSource } from '../../../api/paper';
import Figures from './figures';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/reducer';
import MobileFullPaperItem from './mobileFullPaperItem';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperItem.scss');

interface BasePaperItemProps {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  hideFigure?: boolean;
  sourceDomain?: PaperSource;
  ownProfileId?: string;
}
type PaperItemProps = BasePaperItemProps & { paperId: string };
type FullPaperItemWithPaperProps = BasePaperItemProps & { paper: Paper };

export const FullPaperItemWithPaper: FC<FullPaperItemWithPaperProps> = memo(
  ({ paper, actionArea, pageType, sourceDomain, hideFigure, ownProfileId }) => {
    const userDevice = useSelector((state: AppState) => state.layout.userDevice);
    if (userDevice === UserDevice.MOBILE) {
      return (
        <MobileFullPaperItem paper={paper} actionArea={actionArea} pageType={pageType} sourceDomain={sourceDomain} />
      );
    }

    return (
      <div className={s.paperItemWrapper}>
        <Title paper={paper} actionArea={actionArea} pageType={pageType} />
        <div style={{ marginTop: '12px' }}>
          <BlockVenueAuthor paper={paper} pageType={pageType} actionArea={actionArea} ownProfileId={ownProfileId} />
        </div>
        <Abstract
          paperId={paper.id}
          abstract={paper.abstractHighlighted || paper.abstract}
          pageType={pageType}
          actionArea={actionArea}
        />
        {!hideFigure && <Figures figures={paper.figures} paperId={paper.id} />}
        <PaperItemButtonGroup
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          paperSource={sourceDomain}
          saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
        />
      </div>
    );
  },
  isEqual
);

const FullPaperItem: FC<PaperItemProps> = memo(({ paperId, ...props }) => {
  useStyles(s);
  const paper = useSelector<AppState, Paper | undefined>(
    state => denormalize(paperId, paperSchema, state.entities),
    isEqual
  );

  if (!paper) return null;

  return <FullPaperItemWithPaper paper={paper} {...props} />;
});

export default FullPaperItem;
