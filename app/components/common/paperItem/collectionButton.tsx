import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
import { connect } from "react-redux";
import { AppState } from "../../../reducers";
import { UserCollectionsState } from "../../collections/reducer";
const styles = require("./collectionButton.scss");

function mapStateToProps(state: AppState) {
  return {
    userCollections: state.userCollections,
  };
}

interface CollectionButtonProps {
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  hasCollection: boolean;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  onRemove?: (paperId: number) => Promise<void>;
  userCollections: UserCollectionsState;
}

const CollectionButton: React.SFC<CollectionButtonProps> = ({
  paperId,
  pageType,
  actionArea,
  hasCollection,
  onRemove,
  userCollections,
}) => {
  if (hasCollection && onRemove) {
    return (
      <button
        className={styles.addCollectionBtnWrapper}
        onClick={() => {
          onRemove(paperId);
          trackEvent({
            category: "Additional Action",
            action: "Click [Remove from Collection] Button",
          });
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
        if (!userCollections.collectionIds || userCollections.collectionIds.length === 0) {
          GlobalDialogManager.openNewCollectionDialog(paperId);
        } else {
          GlobalDialogManager.openCollectionDialog(paperId);
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
