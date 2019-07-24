import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PaperInCollection } from '../../model/paperInCollection';
import { CurrentUser } from '../../model/currentUser';
import { CollectionShowState } from '../../containers/collectionShow/reducer';
import { Collection } from '../../model/collection';
import CollectionPaperItem from './collectionPaperItem';
import ArticleSpinner from '../common/spinner/articleSpinner';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import { removePaperFromCollection } from '../dialog/actions';
import formatNumber from '../../helpers/formatNumber';
import CollectionPapersControlBtns from './collectionPapersControlBtns';
import { ACTION_TYPES } from '../../actions/actionTypes';
const styles = require('./collectionPaperList.scss');

interface CollectionPaperListProps {
  itsMine: boolean;
  papersInCollection: PaperInCollection[];
  currentUser: CurrentUser;
  collectionShow: CollectionShowState;
  userCollection: Collection;
  dispatch: Dispatch<any>;
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
  const { itsMine, papersInCollection, currentUser, collectionShow, userCollection, dispatch } = props;

  const handleRemovePaperFromCollection = React.useCallback(
    async (paperIds: number | number[]) => {
      let param;
      if (typeof paperIds === 'object') {
        param = paperIds;
      } else {
        param = [paperIds];
      }

      let removeConfirm;

      if (param.length >= 2) {
        removeConfirm = confirm(`Are you sure to remove ${param.length} paper from '${userCollection.title}'?`);
      } else {
        removeConfirm = confirm(`Are you sure to remove this paper from '${userCollection.title}'?`);
      }

      if (userCollection && removeConfirm) {
        try {
          await dispatch(removePaperFromCollection({ paperIds: param, collection: userCollection }));
        } catch (err) {}
      }
    },
    [dispatch, userCollection]
  );

  if (collectionShow.isLoadingPaperToCollection) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if (userCollection && papersInCollection && papersInCollection.length > 0) {
    const collectionPaperList = papersInCollection.map(paper => {
      return (
        <div className={styles.paperItemWrapper} key={paper.paperId}>
          {itsMine && (
            <input
              type="checkbox"
              className={styles.paperCheckBox}
              checked={collectionShow.selectedPaperIds.includes(paper.paperId)}
              onClick={() => {
                dispatch({
                  type: ACTION_TYPES.COLLECTION_SHOW_SELECT_PAPER_ITEM,
                  payload: { paperId: paper.paperId },
                });
              }}
              readOnly
            />
          )}
          <CollectionPaperItem
            currentUser={currentUser}
            pageType="collectionShow"
            actionArea="paperList"
            paperNote={paper.note ? paper.note : ''}
            paper={paper.paper}
            collection={userCollection}
            onRemovePaperCollection={handleRemovePaperFromCollection}
          />
        </div>
      );
    });
    return (
      <>
        <CollectionPapersControlBtns
          itsMine={itsMine}
          collectionShow={collectionShow}
          onRemovePaperCollection={handleRemovePaperFromCollection}
        />
        <CollectionPaperInfo collectionShow={collectionShow} />
        {collectionPaperList}
      </>
    );
  } else {
    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>No paper in this collection.</div>
      </div>
    );
  }
};

export default connect()(withStyles<typeof CollectionPaperList>(styles)(CollectionPaperList));
