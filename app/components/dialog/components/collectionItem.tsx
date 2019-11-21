import * as React from 'react';
import * as classNames from 'classnames';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as parse from 'date-fns/parse';
import Icon from '../../../icons';
import ButtonSpinner from '../../common/button/spinner';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Collection } from '../../../model/collection';
import { AddPaperToCollectionParams, RemovePapersFromCollectionParams } from '../../../api/collection';
import { trackEvent } from '../../../helpers/handleGA';
const styles = require('./collectionItem.scss');

interface CollectionItemProps {
  collectionDialogPaperId: string;
  collection: Collection;
  handleAddingPaperToCollections: (params: AddPaperToCollectionParams) => Promise<void>;
  handleRemovingPaperFromCollection: (params: RemovePapersFromCollectionParams) => Promise<void>;
}

interface CollectionItemStates {
  isLoading: boolean;
  hasFailed: boolean;
}

@withStyles<typeof CollectionItem>(styles)
class CollectionItem extends React.PureComponent<CollectionItemProps, CollectionItemStates> {
  public constructor(props: CollectionItemProps) {
    super(props);

    this.state = {
      isLoading: false,
      hasFailed: false,
    };
  }

  public render() {
    const { collection } = this.props;

    const parsedUpdatedAt = parse(collection.updatedAt);

    return (
      <li
        className={classNames({
          [`${styles.collectionItem}`]: true,
          [`${styles.selected}`]: collection.containsSelected,
        })}
        key={`collection_dialog_${collection.id}`}
        onClick={() => {
          this.handleSelectCollectionItem(collection);
        }}
      >
        <div className={styles.collectionTitle}>{collection.title}</div>
        <div className={styles.paperCount}>
          {`${collection.paperCount} papers · ${distanceInWordsToNow(parsedUpdatedAt)} ago`}
        </div>

        <div className={styles.collectionIconWrapper}>{this.getCollectionItemIcon(collection)}</div>
      </li>
    );
  }

  private getCollectionItemIcon = (collection: Collection) => {
    const { isLoading } = this.state;

    if (isLoading) {
      return <ButtonSpinner color="gray" variant="outlined" size="small" />;
    } else if (collection.containsSelected) {
      return <Icon icon="MINUS" />;
    } else {
      return <Icon icon="PLUS" />;
    }
  };

  private handleSelectCollectionItem = async (collection: Collection) => {
    const { handleAddingPaperToCollections, handleRemovingPaperFromCollection, collectionDialogPaperId } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return;
    }

    try {
      this.setState({ isLoading: true, hasFailed: false });

      if (collection.containsSelected) {
        await handleRemovingPaperFromCollection({
          collection,
          paperIds: [collectionDialogPaperId],
        });
        trackEvent({ category: 'Additional Action', action: 'Remove Paper in Collection', label: `${collection.id}` });
      } else {
        await handleAddingPaperToCollections({
          collection,
          paperId: collectionDialogPaperId,
        });
        trackEvent({ category: 'Additional Action', action: 'Add Paper to Collection', label: `${collection.id}` });
      }

      this.setState({ isLoading: false, hasFailed: false });
    } catch (err) {
      this.setState({ isLoading: false, hasFailed: true });
    }
  };
}
export default CollectionItem;
