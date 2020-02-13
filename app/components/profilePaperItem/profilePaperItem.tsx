import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import { isEqual } from 'lodash';
import { PaperSource } from '../../api/paper';
import { AppState } from '../../reducers';
import { UserDevice } from '../layouts/reducer';
import { Paper, paperSchema } from '../../model/paper';
import Title from '../common/paperItem/title';
import Abstract from '../common/paperItem/abstract';
import BlockVenueAuthor from '../common/paperItem/blockVenueAuthor';
import UnconfirmedPaperItemButtonGroup from '../common/paperItem/unconfirmedPaperItemButtonGroup';
import MobileVenueAuthors from '../common/paperItem/mobileVenueAuthors';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profilePaperItem.scss');

interface BasePaperItemProps {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  fetchProfileShowData: () => void;
  sourceDomain?: PaperSource;
  ownProfileSlug?: string;
  isEditable?: boolean;
}
type PaperItemProps = BasePaperItemProps & { paperId: string };
type ProfilePaperItemWithPaperProps = BasePaperItemProps & { paper: Paper };

export const ProfilePaperItemWithPaper: FC<ProfilePaperItemWithPaperProps> = memo(
  ({ paper, actionArea, pageType, sourceDomain, ownProfileSlug, isEditable, fetchProfileShowData }) => {
    const userDevice = useSelector((state: AppState) => state.layout.userDevice);

    let venueAuthors = (
      <div style={{ marginTop: '12px' }}>
        <BlockVenueAuthor
          paper={paper}
          pageType="collectionShow"
          actionArea="paperList"
          ownProfileSlug={ownProfileSlug}
        />
      </div>
    );
    if (userDevice === UserDevice.MOBILE) {
      venueAuthors = <MobileVenueAuthors paper={paper} pageType="collectionShow" actionArea="paperList" />;
    }

    return (
      <div className={s.paperItemWrapper}>
        <Title paper={paper} actionArea={actionArea} pageType={pageType} showNewLabel={true} />
        {venueAuthors}
        <Abstract
          paperId={paper.id}
          abstract={paper.abstractHighlighted || paper.abstract}
          pageType={pageType}
          actionArea={actionArea}
        />
        <UnconfirmedPaperItemButtonGroup
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          paperSource={sourceDomain}
          saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
          ownProfileSlug={ownProfileSlug}
          isEditable={isEditable}
          fetchProfileShowData={fetchProfileShowData}
        />
      </div>
    );
  },
  isEqual
);

const ProfilePaperItem: FC<PaperItemProps> = memo(({ paperId, ...props }) => {
  useStyles(s);
  const paper = useSelector<AppState, Paper | undefined>(
    state => denormalize(paperId, paperSchema, state.entities),
    isEqual
  );

  if (!paper) return null;

  return <ProfilePaperItemWithPaper paper={paper} {...props} />;
});

export default ProfilePaperItem;
