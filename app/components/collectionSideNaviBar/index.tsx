import * as React from "react";
import { Collection, collectionSchema } from "../../model/collection";
import { withStyles } from "../../helpers/withStylesHelper";
import { connect } from "react-redux";
import { AppState } from "../../reducers";
import { denormalize } from "normalizr";
import { MyCollectionsState } from "../../containers/paperShowCollectionControlButton/reducer";
import Icon from "../../icons";
import { Link } from "react-router-dom";
import * as classNames from "classnames";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { CurrentUser } from "../../model/currentUser";
import CircularProgress from "@material-ui/core/CircularProgress";
const styles = require("./collectionSideNaviBar.scss");

interface CollectionSideNaviBarProps {
  myCollections: MyCollectionsState;
  collections: Collection[] | undefined;
  currentCollectionId: number;
  currentUser: CurrentUser;
}

function getCollectionsList(
  collections: Collection[] | undefined,
  isLoadingCollections: boolean,
  currentCollectionId: number
) {
  if (isLoadingCollections) {
    return (
      <div className={styles.spinnerWrapper}>
        <CircularProgress className={styles.loadingSpinner} disableShrink={true} size={14} thickness={4} />
      </div>
    );
  }

  const collectionsList =
    collections &&
    collections.map((collection, index) => {
      return (
        <Link
          key={index}
          to={`/collections/${collection.id}`}
          className={classNames({
            [styles.collectionItemTitle]: true,
            [styles.currentCollectionItemTitle]: currentCollectionId === collection.id,
          })}
        >
          {collection.title}
        </Link>
      );
    });

  return collectionsList;
}

const CollectionSideNaviBar: React.FunctionComponent<CollectionSideNaviBarProps> = props => {
  const { collections, myCollections, currentCollectionId, currentUser } = props;

  return (
    <div className={styles.sideNaviBarWrapper}>
      <div className={styles.naviBarTitle}>
        <Link className={styles.naviBarTitleLink} to={`/users/${currentUser.id}/collections`}>
          <Icon className={styles.collectionIcon} icon="COLLECTION" />Collections
        </Link>
      </div>
      <div className={styles.naviBarContent}>
        {getCollectionsList(collections, myCollections.isLoadingCollections, currentCollectionId)}
        <button
          className={styles.createNewCollectionBtn}
          onClick={() => {
            GlobalDialogManager.openNewCollectionDialog();
          }}
        >
          + Create a Collection
        </button>
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    myCollections: state.myCollections,
    collections: denormalize(state.myCollections.collectionIds, [collectionSchema], state.entities).filter(
      (c: Collection) => !!c
    ),
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(withStyles<typeof CollectionSideNaviBar>(styles)(CollectionSideNaviBar));
