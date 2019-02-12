import * as React from "react";
import PaperItem, { PaperItemProps } from "../common/paperItem";
import { withStyles } from "../../helpers/withStylesHelper";
import CollectionPaperNote from "../collectionPaperNote";
const styles = require("./collectionPaperItem.scss");

// tslint:disable-next-line:no-empty-interface
interface CollectionPaperItemProps extends PaperItemProps {
  collectionId: number;
}

class CollectionPaperItem extends React.PureComponent<CollectionPaperItemProps> {
  public render() {
    const { paper, paperNote, collectionId, onRemovePaperCollection } = this.props;

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
          <PaperItem {...paperItemProps} hasCollection={true} onRemovePaperCollection={onRemovePaperCollection} />
        </div>
        <CollectionPaperNote note={paperNote} collectionId={collectionId} paperId={paper.id} />
      </div>
    );
  }
}

export default withStyles<typeof CollectionPaperItem>(styles)(CollectionPaperItem);
