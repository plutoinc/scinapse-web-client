import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { AppState } from "../../../reducers";
import { connect, Dispatch } from "react-redux";
import { denormalize } from "normalizr";
import { collectionSchema, Collection } from "../../../model/collection";
import { CurrentUser } from "../../../model/currentUser";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { MyCollectionsState } from "../../../containers/paperShowCollectionControlButton/reducer";
const styles = require("./collectionList.scss");

export interface CollectionListProps
  extends Readonly<{
      currentUser: CurrentUser;
      myCollections: MyCollectionsState;
      collections: Collection[] | null;
      dispatch: Dispatch<any>;
    }> {}

const CollectionList: React.SFC<CollectionListProps> = props => {
  if (props.currentUser.isLoggingIn || props.myCollections.isLoadingCollections) {
    return <ButtonSpinner className={styles.spinner} color="#6096ff" thickness={4} />;
  }

  let memoList = null;
  memoList =
    props.collections &&
    props.collections.length > 0 &&
    props.collections.map(collection => {
      if (collection.note) {
        return (
          <li className={styles.memoItem} key={collection.id}>
            <div className={styles.memoContent}>{collection.note}</div>
            <div className={styles.memoCollectionName}>
              - Saved to <span className={styles.name}>{collection.title}</span>
            </div>
          </li>
        );
      }

      return null;
    });

  if (!memoList) {
    return null;
  }

  return (
    <div className={styles.yourCollectionMemo}>
      <div className={styles.sideNavigationBlockHeader}>Your Collection Memo</div>
      <ul className={styles.memoList}>{memoList}</ul>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    currentUser: state.currentUser,
    myCollections: state.myCollections,
    collections: denormalize(state.myCollections.collectionIds, [collectionSchema], state.entities),
  };
};

export default connect(mapStateToProps)(withStyles<typeof CollectionList>(styles)(CollectionList));
