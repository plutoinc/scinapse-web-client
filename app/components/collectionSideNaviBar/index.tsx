import * as React from "react";
import { Collection, userCollectionSchema } from "../../model/collection";
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
import ActionTicketManager from "../../helpers/actionTicketManager";
const styles = require("./collectionSideNaviBar.scss");

interface CollectionSideNaviBarProps {
  myCollections: MyCollectionsState;
  userCollections: Collection[] | undefined;
  currentCollectionId: number;
  currentUser: CurrentUser;
}

function getCollectionsList(
  userCollections: Collection[] | undefined,
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
    userCollections &&
    userCollections.map((collection, index) => {
      return (
        <Link
          key={index}
          to={`/collections/${collection.id}`}
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType: "collectionShow",
              actionType: "fire",
              actionArea: "sideNavigator",
              actionTag: "collectionShow",
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

  return collectionsList;
}

const CollectionSideNaviBar: React.FunctionComponent<CollectionSideNaviBarProps> = props => {
  const { userCollections, myCollections, currentCollectionId, currentUser } = props;

  return (
    <div className={styles.sideNaviBarWrapper}>
      <div className={styles.naviBarTitle}>
        <Link className={styles.naviBarTitleLink} to={`/users/${currentUser.id}/collections`}>
          <Icon className={styles.collectionIcon} icon="COLLECTION" />Collections
        </Link>
      </div>
      <div className={styles.naviBarContent}>
        {getCollectionsList(userCollections, myCollections.isLoadingCollections, currentCollectionId)}
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
    userCollections: denormalize(state.myCollections.collectionIds, [userCollectionSchema], state.entities).filter(
      (c: Collection) => !!c
    ),
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(withStyles<typeof CollectionSideNaviBar>(styles)(CollectionSideNaviBar));
