import * as React from "react";
import PaperItem, { PaperItemProps } from "../common/paperItem";
import { withStyles } from "../../helpers/withStylesHelper";
import { Collection } from "../../model/collection";
const styles = require("./collectionPaperItem.scss");

// tslint:disable-next-line:no-empty-interface
interface CollectionPaperItemProps extends PaperItemProps {
  collection: Collection;
}

interface CollectionPaperItemState {
  paperItemHeight: number;
}

class CollectionPaperItem extends React.PureComponent<CollectionPaperItemProps, CollectionPaperItemState> {
  private paperItemNode: HTMLDivElement | null;

  public constructor(props: CollectionPaperItemProps) {
    super(props);
    this.state = {
      paperItemHeight: 0,
    };
  }

  public componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      paperItemHeight: this.paperItemNode ? this.paperItemNode.offsetHeight : 0,
    }));
  }

  public render() {
    const { onRemovePaperCollection } = this.props;

    const paperItemProps = {
      ...this.props,
      wrapperStyle: {
        borderBottom: "none",
        marginBottom: "0",
        paddingBottom: "0",
        maxWidth: "100%",
      },
    };

    return (
      <div className={styles.CollectionPaperItemWrapper}>
        <div ref={el => (this.paperItemNode = el)} className={styles.paper}>
          <PaperItem {...paperItemProps} hasCollection={true} onRemovePaperCollection={onRemovePaperCollection} />
        </div>
      </div>
    );
  }
}

export default withStyles<typeof CollectionPaperItem>(styles)(CollectionPaperItem);
