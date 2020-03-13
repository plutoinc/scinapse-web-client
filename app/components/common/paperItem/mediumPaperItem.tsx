import React, { FC } from 'react';
import { Paper } from '../../../model/paper';
import { PaperSource } from '../../../api/paper';
import Title from './title';
import BlockVenueAuthor from './blockVenueAuthor';
import PaperItemButtonGroup from './paperItemButtonGroup';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./paperItem.scss');

interface Props {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  sourceDomain?: PaperSource;
}

const MediumPaperItem: FC<Props> = React.memo(({ paper, pageType, actionArea, sourceDomain }) => {
  useStyles(s);

  return (
    <div className={s.paperItemWrapper}>
      <Title paper={paper} actionArea={actionArea} pageType={pageType} />
      <div style={{ marginTop: '12px' }}>
        <BlockVenueAuthor paper={paper} pageType={pageType} actionArea={actionArea} />
      </div>
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

export default MediumPaperItem;
