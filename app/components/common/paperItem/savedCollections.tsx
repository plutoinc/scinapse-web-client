import * as React from 'react';
import { Link } from 'react-router-dom';
import { SavedInCollection } from '../../../model/savedInCollection';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
const styles = require('./savedCollections.scss');

const MAX_LENGTH_OF_COLLECTION_NAME = 45;

export interface SavedCollectionsProps {
  collections: SavedInCollection[];
}

class SavedCollections extends React.PureComponent<SavedCollectionsProps> {
  public render() {
    const { collections } = this.props;

    const targetCollections = collections.slice(0, 2);

    const itemsLength = targetCollections.length;

    const collectionItems = targetCollections.map((collection, index) => {
      const isLast = index === itemsLength - 1;
      const rawTitle = collection.title;
      let finalTitle;

      if (rawTitle.length <= MAX_LENGTH_OF_COLLECTION_NAME) {
        finalTitle = rawTitle;
      } else {
        finalTitle = rawTitle.slice(0, MAX_LENGTH_OF_COLLECTION_NAME) + '...';
      }

      return (
        <Link key={collection.id} className={styles.collectionTitle} to={`/collections/${collection.id}`}>
          {finalTitle}
          {!isLast ? ', ' : null}
        </Link>
      );
    });

    return (
      <div className={styles.itemWrapper}>
        <Icon icon="BOOKMARK" className={styles.bookmarkIcon} />
        <span className={styles.subContext}>Saved in </span>
        {collectionItems}
      </div>
    );
  }
}

export default withStyles<typeof SavedCollections>(styles)(SavedCollections);
