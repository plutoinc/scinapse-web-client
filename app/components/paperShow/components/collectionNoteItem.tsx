import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Collection } from "../../../model/collection";
import { Link } from "react-router-dom";
const styles = require("./collectionNoteList.scss");

interface CollectionNoteItemProps {
  collection: Collection;
  handleAnimationEnd: (collection: Collection) => void;
}

@withStyles<typeof CollectionNoteItem>(styles)
class CollectionNoteItem extends React.PureComponent<CollectionNoteItemProps> {
  private memoItemNode: HTMLLIElement | null;

  public componentDidMount() {
    if (this.memoItemNode) {
      this.memoItemNode.addEventListener("animationend", this.handleAnimationEnd, { passive: true });
    }
  }

  public componentWillUnmount() {
    if (this.memoItemNode) {
      this.memoItemNode.removeEventListener("animationend", this.handleAnimationEnd);
    }
  }

  public render() {
    const { collection } = this.props;

    return (
      <li
        ref={el => (this.memoItemNode = el)}
        className={classNames({
          [styles.memoItem]: true,
          [styles.updatedMemoItem]: collection.noteUpdated,
        })}
      >
        <div className={styles.memoContent}>{collection.note}</div>
        <div className={styles.memoCollectionName}>
          - Saved to{" "}
          <Link className={styles.name} to={`/collections/${collection.id}`}>
            {collection.title}
          </Link>
        </div>
      </li>
    );
  }

  private handleAnimationEnd = () => {
    const { handleAnimationEnd, collection } = this.props;

    handleAnimationEnd(collection);
  };
}

export default CollectionNoteItem;
