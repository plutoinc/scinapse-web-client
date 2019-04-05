import * as React from "react";
import { denormalize } from "normalizr";
import { withStyles } from "../../../helpers/withStylesHelper";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
import { connect } from "react-redux";
import { AppState } from "../../../reducers";
import { CurrentUser } from "../../../model/currentUser";
import { collectionSchema, Collection } from "../../../model/collection";
import { MyCollectionsState } from "../../../containers/paperShowCollectionControlButton/reducer";
const styles = require("./collectionButton.scss");

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    myCollections: state.myCollections,
    collection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities),
  };
}

interface CollectionButtonProps {
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  hasCollection: boolean;
  currentUser: CurrentUser;
  collection: Collection | undefined;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  onRemove?: (paperId: number) => Promise<void>;
  myCollections: MyCollectionsState;
}

function handleAddToCollection(myCollections: MyCollectionsState, paperId: number) {
  if (!myCollections.collectionIds || myCollections.collectionIds.length === 0) {
    GlobalDialogManager.openNewCollectionDialog(paperId);
  } else {
    GlobalDialogManager.openCollectionDialog(paperId);
  }
}

const CollectionButton: React.SFC<CollectionButtonProps> = ({
  paperId,
  pageType,
  actionArea,
  hasCollection,
  onRemove,
  myCollections,
  currentUser,
  collection,
}) => {
  const itsMine = collection && collection.createdBy.id === currentUser.id ? true : false;

  if (hasCollection && onRemove && itsMine) {
    return (
      <button
        className={styles.addCollectionBtnWrapper}
        onClick={() => {
          onRemove(paperId);
          trackEvent({ category: "Additional Action", action: "Click [Remove from Collection] Button" });
          ActionTicketManager.trackTicket({
            pageType,
            actionType: "fire",
            actionArea: actionArea || pageType,
            actionTag: "removeFromCollection",
            actionLabel: String(paperId),
          });
        }}
      >
        <Icon className={styles.buttonIcon} icon="TRASH_CAN" />
        <span>Remove from Collection</span>
      </button>
    );
  }

  return (
    <button
      className={styles.addCollectionBtnWrapper}
      onClick={() => {
        if (currentUser.isLoggedIn) {
          handleAddToCollection(myCollections, paperId);
        } else {
          GlobalDialogManager.openSignInDialog();
        }
        trackEvent({
          category: "Additional Action",
          action: "Click [Add To Collection] Button",
        });
        ActionTicketManager.trackTicket({
          pageType,
          actionType: "fire",
          actionArea: actionArea || pageType,
          actionTag: "addToCollection",
          actionLabel: String(paperId),
        });
      }}
    >
      <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
      <span>Add To Collection</span>
    </button>
  );
};

export default connect(mapStateToProps)(withStyles<typeof CollectionButton>(styles)(CollectionButton));
