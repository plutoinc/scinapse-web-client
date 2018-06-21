import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./collection.scss");

@withStyles<typeof CollectionModal>(styles)
class CollectionModal extends React.PureComponent<{}, {}> {
  public render() {
    return (
      <div className={styles.modalWrapper}>
        <div className={styles.closeButton}>close button</div>
        <div className={styles.modalHeader}>Add this paper to the collections</div>
        <div className={styles.contentBox}>
          <ul>
            <li>Collection Item</li>
          </ul>
        </div>

        <div className={styles.modalFooter}>
          create new collection
          cancel
          next
        </div>
      </div>
    )
  }
}
export default CollectionModal;
