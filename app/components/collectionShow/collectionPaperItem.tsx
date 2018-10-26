import * as React from "react";
import PaperItem, { PaperItemProps } from "../common/paperItem";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./collectionPaperItem.scss");

// tslint:disable-next-line:no-empty-interface
export interface CollectionPaperItemProps extends PaperItemProps {}

class CollectionPaperItem extends React.PureComponent<CollectionPaperItemProps, {}> {
  public render() {
    const paperItemProps = {
      ...this.props,
      wrapperStyle: {
        borderBottom: "none",
        marginBottom: "0",
        paddingBottom: "0",
      },
    };
    return (
      <div className={styles.CollectionPaperItemWrapper}>
        <div className={styles.paper}>
          <PaperItem {...paperItemProps} />
        </div>
        <div className={styles.memo}>
          <div className={styles.memo_item}>{this.props.paperNote}</div>
        </div>
      </div>
    );
  }
}

export default withStyles<typeof CollectionPaperItem>(styles)(CollectionPaperItem);
