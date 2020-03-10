import React, { FC } from 'react';
import Icon from '../../icons';
import Title from '../common/paperItem/title';
import BlockVenueAuthor from '../common/paperItem/blockVenueAuthor';
import MobileVenueAuthors from '../common/paperItem/mobileVenueAuthors';
import CollectionPaperItemButtonGroup from '../common/paperItem/collectionPaperItemButtonGroup';
import { PaperInCollection } from '../../model/paperInCollection';
const styles = require('./collectionPaperItem.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

interface Props {
  paper: PaperInCollection;
  inOwnCollection: boolean;
  isMobile: boolean;
  isChecked: boolean;
  collectionId: number;
  onClickCheckBox: (paperId: string) => void;
  onClickXButton: (paperId: string) => void;
}

const CollectionPaperItem: FC<Props> = ({
  paper,
  inOwnCollection,
  isMobile,
  isChecked,
  collectionId,
  onClickCheckBox,
  onClickXButton,
}) => {
  useStyles(styles);

  let venueAuthors = (
    <div style={{ marginTop: '12px' }}>
      <BlockVenueAuthor paper={paper.paper} pageType="collectionShow" actionArea="paperList" />
    </div>
  );
  if (isMobile) {
    venueAuthors = <MobileVenueAuthors paper={paper.paper} pageType="collectionShow" actionArea="paperList" />;
  }

  return (
    <div className={styles.paperItemWrapper}>
      {inOwnCollection && !isMobile && (
        <input
          type="checkbox"
          className={styles.paperCheckBox}
          checked={isChecked}
          onClick={() => onClickCheckBox(paper.paperId)}
          readOnly
        />
      )}
      <div className={styles.itemWrapper}>
        {inOwnCollection && (
          <Icon onClick={() => onClickXButton(paper.paperId)} icon="X_BUTTON" className={styles.removeIcon} />
        )}
        <div className={styles.paperInformationWrapper}>
          <Title pageType="collectionShow" actionArea="paperList" paper={paper.paper} />
          {venueAuthors}
        </div>
        <CollectionPaperItemButtonGroup
          pageType="collectionShow"
          actionArea="paperList"
          paper={paper.paper}
          collectionId={collectionId}
          note={paper.note || undefined}
        />
      </div>
    </div>
  );
};

export default CollectionPaperItem;
