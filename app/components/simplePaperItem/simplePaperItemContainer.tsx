import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { AppState } from '../../reducers';
import { paperSchema, Paper } from '../../model/paper';
import Title from '../../components/common/paperItem/title';
import SimplePaperItemButtonGroup from '../common/paperItem/simplePaperItemButtonGroup';
import MobileVenueAuthors from '../common/paperItem/mobileVenueAuthors';
import { useObserver } from '../../hooks/useIntersectionHook';
const s = require('./simplePaperItem.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

type ContainerProps = SimplePaperItemProps & {
  paperId: string;
};

interface SimplePaperItemProps {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
  contentClassName?: string;
}

export const SimplePaperItem: FC<SimplePaperItemProps & { paper: Paper }> = React.memo(
  ({ pageType, actionArea, className, contentClassName, paper }) => {
    useStyles(s);
    const { elRef } = useObserver(0.8, {
      pageType,
      actionArea,
      actionType: 'view',
      actionTag: 'paperShow',
      actionLabel: String(paper.id),
    });

    if (!paper) return null;

    return (
      <div
        ref={elRef}
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
          <MobileVenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} />
          <div className={s.btnGroupWrapper}>
            <SimplePaperItemButtonGroup
              pageType={pageType}
              actionArea={actionArea}
              paper={paper}
              saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
            />
          </div>
        </div>
      </div>
    );
  },
  isEqual
);

const SimplePaperItemContainer: FC<ContainerProps> = React.memo(
  ({ paperId, pageType, actionArea, className, contentClassName }) => {
    useStyles(s);
    const paper: Paper | null = useSelector(
      (state: AppState) => denormalize(paperId, paperSchema, state.entities),
      isEqual
    );

    if (!paper) return null;

    return (
      <SimplePaperItem
        paper={paper}
        pageType={pageType}
        actionArea={actionArea}
        className={className}
        contentClassName={contentClassName}
      />
    );
  }
);

export default SimplePaperItemContainer;
