import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Collection } from "../../../model/collection";
import { CollectionBoxProps } from "./collectionBox";
const styles = require("./collectionList.scss");

export interface CollectionListProps
  extends Readonly<{
      myCollections: Collection[];
      papersInCollection: any;
    }> {}

class CollectionList extends React.PureComponent<CollectionListProps, {}> {
  public constructor(props: CollectionBoxProps) {
    super(props);
  }

  public render() {
    return (
      <div className={styles.yourCollectionMemo}>
        <div className={styles.sideNavigationBlockHeader}>Your Collection Memo</div>
        <ul className={styles.memoList}>
          {this.props.papersInCollection.map((paper: any) => {
            if (paper) {
              return (
                <li className={styles.memoItem} key={paper.collection_id}>
                  <div className={styles.memoContent}>{paper.note}</div>
                  <div className={styles.memoCollectionName}>
                    - Saved to{" "}
                    <span className={styles.name}>
                      {this.props.myCollections.filter(obj => obj.id === paper.collection_id)[0].title}
                    </span>
                  </div>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  }
}

export default withStyles<typeof CollectionList>(styles)(CollectionList);
