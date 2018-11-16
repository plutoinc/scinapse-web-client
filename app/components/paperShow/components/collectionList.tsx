import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperInCollection } from "../../../model/paperInCollection";
import { Collection } from "../../../model/collection";
import { CollectionBoxProps } from "./collectionBox";
const styles = require("./collectionList.scss");

export interface collectionListProps
  extends Readonly<{
      myCollections: Collection[];
      papersInCollection: PaperInCollection[];
    }> {}

class collectionList extends React.PureComponent<collectionListProps, {}> {
  public constructor(props: CollectionBoxProps) {
    super(props);
  }
  public render() {
    console.log(this.props.myCollections);
    console.log(this.props.papersInCollection);
    return (
      <div className={styles.relatedPapers}>
        <div className={styles.sideNavigationBlockHeader}>Related Papers</div>
      </div>
    );
  }
}

export default withStyles<typeof collectionList>(styles)(collectionList);
