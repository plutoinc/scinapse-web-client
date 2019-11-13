import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Collection, collectionSchema } from '../../model/collection';
import { withStyles } from '../../helpers/withStylesHelper';
import { AppState } from '../../reducers';
import { MyCollectionsState } from '../../containers/paperShowCollectionControlButton/reducer';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { CurrentUser } from '../../model/currentUser';
import ActionTicketManager from '../../helpers/actionTicketManager';
import Icon from '../../icons';
import { Member } from '../../model/member';
const styles = require('./collectionSideNaviBar.scss');

interface CollectionSideNaviBarProps {
  collections: MyCollectionsState;
  myCollections: Collection[] | undefined;
  userCollections: Collection[] | undefined;
  currentCollectionId: string;
  currentUser: CurrentUser;
  collectionCreateBy: Member;
}

interface CollectionListProps {
  userCollections: Collection[] | undefined;
  isLoadingCollections: boolean;
  currentCollectionId: string;
}

const CollectionsList: React.FunctionComponent<CollectionListProps> = React.memo(props => {
  const { userCollections, isLoadingCollections, currentCollectionId } = props;

  if (isLoadingCollections) {
    return (
      <div className={styles.spinnerWrapper}>
        <CircularProgress className={styles.loadingSpinner} disableShrink={true} size={14} thickness={4} />
      </div>
    );
  }

  const collectionsList =
    userCollections &&
    userCollections.map(collection => {
      return (
        <Link
          key={collection.id}
          to={`/collections/${collection.id}`}
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType: 'collectionShow',
              actionType: 'fire',
              actionArea: 'sideNavigator',
              actionTag: 'collectionShow',
              actionLabel: String(collection.id),
            });
          }}
          className={classNames({
            [styles.collectionItemTitle]: true,
            [styles.currentCollectionItemTitle]: currentCollectionId === collection.id,
          })}
        >
          {collection.title}
        </Link>
      );
    });

  return <>{collectionsList}</>;
});

const CollectionSideNaviBarTitle: React.FunctionComponent<{
  collectionCreateById: string;
  isLoggedIn: boolean;
  currentUserId: string;
}> = React.memo(props => {
  const { collectionCreateById, isLoggedIn, currentUserId } = props;

  const itsMine = isLoggedIn && currentUserId === collectionCreateById;
  if (itsMine) {
    return (
      <Link className={styles.naviBarTitleLink} to={`/users/${currentUserId}/collections`}>
        <Icon className={styles.collectionIcon} icon="COLLECTION" />My Collections
      </Link>
    );
  } else {
    return (
      <Link className={styles.naviBarTitleLink} to={`/users/${collectionCreateById}/collections`}>
        <Icon className={styles.collectionIcon} icon="COLLECTION" />Collections
      </Link>
    );
  }
});

const CollectionSideNaviBar: React.FunctionComponent<CollectionSideNaviBarProps> = props => {
  const { myCollections, userCollections, collections, currentCollectionId, currentUser, collectionCreateBy } = props;
  const itsMine = currentUser.isLoggedIn && currentUser.id === collectionCreateBy.id;

  return (
    <div className={styles.sideNaviBarWrapper}>
      <div className={styles.naviBarTitle}>
        <CollectionSideNaviBarTitle
          collectionCreateById={collectionCreateBy.id}
          isLoggedIn={currentUser.isLoggedIn}
          currentUserId={currentUser.id}
        />
      </div>
      <div className={styles.naviBarContent}>
        <CollectionsList
          userCollections={itsMine ? myCollections : userCollections}
          isLoadingCollections={collections.isLoadingCollections}
          currentCollectionId={currentCollectionId}
        />
        {itsMine ? (
          <button
            className={styles.createNewCollectionBtn}
            onClick={() => {
              GlobalDialogManager.openNewCollectionDialog();
            }}
          >
            + Create a Collection
          </button>
        ) : null}
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    collections: state.myCollections,
    currentUser: state.currentUser,
    userCollections: denormalize(state.userCollections.collectionIds, [collectionSchema], state.entities).filter(
      (c: Collection) => !!c
    ),
    myCollections: denormalize(state.myCollections.collectionIds, [collectionSchema], state.entities).filter(
      (c: Collection) => !!c
    ),
  };
}

export default connect(mapStateToProps)(withStyles<typeof CollectionSideNaviBar>(styles)(CollectionSideNaviBar));
