import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { AppState } from '../../reducers';
import { paperSchema, Paper } from '../../model/paper';
import Title from '../../components/common/paperItem/title';
import VenueAuthors from '../common/paperItem/venueAuthors';
import SimpleMobilePaperItemButtonGroup from '../common/paperItem/simpleMobileButtonGroup';
const s = require('./mobilePaperShowItem.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

interface Props {
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
  contentClassName?: string;
}

const MobilePaperShowItem: FC<Props> = React.memo(({ paperId, pageType, actionArea, className, contentClassName }) => {
  useStyles(s);
  const paper: Paper | null = useSelector(
    (state: AppState) => denormalize(paperId, paperSchema, state.entities),
    isEqual
  );

  if (!paper) return null;

  return (
    <div
      className={classNames({
        [className!]: !!className,
      })}
    >
      <div
        className={classNames({
          [s.itemWrapper]: true,
          [contentClassName!]: !!className,
        })}
      >
        <Title paper={paper} actionArea={actionArea} pageType={pageType} />
        <VenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} />
        <div className={s.btnGroupWrapper}>
          <SimpleMobilePaperItemButtonGroup
            pageType={pageType}
            actionArea={actionArea}
            paper={paper}
            saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
          />
        </div>
      </div>
    </div>
  );
});

export default MobilePaperShowItem;
