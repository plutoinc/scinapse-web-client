import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
const styles = require("./collectionButton.scss");

interface CollectionButtonProps {
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  hasCollection: boolean;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  onRemove?: (paperId: number) => Promise<void>;
}

const CollectionButton: React.SFC<CollectionButtonProps> = ({
  paperId,
  pageType,
  actionArea,
  hasCollection,
  onRemove,
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
        GlobalDialogManager.openCollectionDialog(paperId);
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

export default withStyles<typeof CollectionButton>(styles)(CollectionButton);
