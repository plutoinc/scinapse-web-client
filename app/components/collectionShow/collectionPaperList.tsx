import React from 'react';
import { PaperInCollection } from '../../model/paperInCollection';
import { CurrentUser } from '../../model/currentUser';
import { CollectionShowState } from '../../containers/collectionShow/reducer';
import { Collection } from '../../model/collection';
import CollectionPaperItem from './collectionPaperItem';
import ArticleSpinner from '../common/spinner/articleSpinner';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { removePaperFromCollection } from '../dialog/actions';
const styles = require('./collectionPaperList.scss');

interface CollectionPaperListProps {
  papersInCollection: PaperInCollection[];
  currentUser: CurrentUser;
  collectionShow: CollectionShowState;
  userCollection: Collection;
  dispatch: Dispatch<any>;
}

const CollectionPaperList: React.FC<CollectionPaperListProps> = props => {
  const { papersInCollection, currentUser, collectionShow, userCollection, dispatch } = props;

  const handleRemovePaperFromCollection = React.useCallback(
    async (paperId: number) => {
      if (userCollection && confirm(`Are you sure to remove this paper from '${userCollection.title}'?`)) {
        try {
          await dispatch(removePaperFromCollection({ paperIds: [paperId], collection: userCollection }));
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
        <CollectionPaperItem
          currentUser={currentUser}
          pageType="collectionShow"
          actionArea="paperList"
          paperNote={paper.note ? paper.note : ''}
          paper={paper.paper}
          collection={userCollection}
          onRemovePaperCollection={handleRemovePaperFromCollection}
          key={paper.paperId}
        />
      );
    });
    return <>{collectionPaperList}</>;
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
