import React from 'react';
import { useSelector } from 'react-redux';
import { PaperInCollection } from '../../model/paperInCollection';
import { CurrentUser } from '../../model/currentUser';
import { CollectionShowState } from '../../containers/collectionShow/reducer';
import { Collection } from '../../model/collection';
import ArticleSpinner from '../common/spinner/articleSpinner';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import CollectionPapersControlBtns from './collectionPapersControlBtns';
import formatNumber from '../../helpers/formatNumber';
import { AppState } from '../../reducers';
import { UserDevice } from '../layouts/reducer';
import CollectionPaperItem from '../collectionPaperItem/collectionPaperItem';
const styles = require('./collectionPaperList.scss');

interface CollectionPaperListProps {
  itsMine: boolean;
  papersInCollection: PaperInCollection[];
  currentUser: CurrentUser;
  collectionShow: CollectionShowState;
  userCollection: Collection;
  onSelectedPaperInCollection: (paperId: number) => void;
  onRemovePaperFromCollection: (paperIds: number | number[]) => Promise<void>;
}

const CollectionPaperInfo: React.FC<{ collectionShow: CollectionShowState }> = ({ collectionShow }) => {
  return (
    <div className={styles.subHeader}>
      <div>
        <span className={styles.resultPaperCount}>{`${formatNumber(collectionShow.papersTotalCount)} Papers `}</span>
        <span className={styles.resultPaperPageCount}>
          {`(${collectionShow.currentPaperListPage} page of ${formatNumber(collectionShow.totalPaperListPage)} pages)`}
        </span>
      </div>
    </div>
  );
};

const CollectionPaperList: React.FC<CollectionPaperListProps> = props => {
  const {
    itsMine,
    papersInCollection,
    collectionShow,
    userCollection,
    onSelectedPaperInCollection,
    onRemovePaperFromCollection,
  } = props;

  const userDevice = useSelector((state: AppState) => state.layout.userDevice);

  if (collectionShow.isLoadingPaperToCollection) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!userCollection || (!papersInCollection || papersInCollection.length === 0)) {
    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>No paper in this collection.</div>
      </div>
    );
  }

  const collectionPaperList = papersInCollection.map(paper => {
    return (
      <CollectionPaperItem
        key={paper.paperId}
        paper={paper}
        isMine={itsMine}
        isMobile={userDevice !== UserDevice.MOBILE}
        isChecked={collectionShow.selectedPaperIds.includes(paper.paperId)}
        collectionId={userCollection.id}
        onClickCheckBox={onSelectedPaperInCollection}
        onClickXButton={onRemovePaperFromCollection}
      />
    );
  });

  return (
    <>
      {userDevice !== UserDevice.MOBILE && (
        <CollectionPapersControlBtns
          itsMine={itsMine}
          collectionShow={collectionShow}
          onRemovePaperCollection={onRemovePaperFromCollection}
        />
      )}
      <CollectionPaperInfo collectionShow={collectionShow} />
      {collectionPaperList}
    </>
  );
};

export default withStyles<typeof CollectionPaperList>(styles)(CollectionPaperList);
