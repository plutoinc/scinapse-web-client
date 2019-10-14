import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '../../../icons';
import ButtonSpinner from '../../common/spinner/buttonSpinner';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Collection } from '../../../model/collection';
import { PostCollectionParams } from '../../../api/collection';
import alertToast from '../../../helpers/makePlutoToastAction';
import { trackEvent } from '../../../helpers/handleGA';
import PlutoAxios from '../../../api/pluto';
const styles = require('./collectionDropdown.scss');

export interface CollectionDropdownProps
  extends Readonly<{
      myCollections: Collection[];
      isLoadingMyCollections: boolean;
      isPositingNewCollection: boolean;
      handleAddingPaperToCollection: (collection: Collection) => Promise<void>;
      handleRemovingPaperFromCollection: (collection: Collection) => Promise<void>;
      handleSubmitNewCollection: (params: PostCollectionParams) => Promise<void>;
    }> {}

export interface CollectionDropdownStates extends Readonly<{}> {
  isExpanded: boolean;
  title: string;
  description: string;
}

class CollectionDropdown extends React.PureComponent<CollectionDropdownProps, CollectionDropdownStates> {
  private collectionListBox: HTMLUListElement | null;

  public constructor(props: CollectionDropdownProps) {
    super(props);

    this.state = {
      isExpanded: false,
      title: '',
      description: '',
    };
  }

  public render() {
    return (
      <div className={styles.collectionDropdownWrapper}>
        <ul ref={el => (this.collectionListBox = el)} className={styles.collectionList}>
          {this.getCollectionList()}
        </ul>
        {this.getNewCollectionSection()}
      </div>
    );
  }

  private getSubmitButton = () => {
    const { isPositingNewCollection } = this.props;

    if (!isPositingNewCollection) {
      return <button type="submit">Create</button>;
    } else {
      return (
        <button disabled={true} type="button">
          <ButtonSpinner color="#81acff" />
        </button>
      );
    }
  };

  private getNewCollectionSection = () => {
    const { isExpanded, title, description } = this.state;

    if (!isExpanded) {
      return (
        <div onClick={this.handleClickNewCollection} className={styles.createCollectionWrapper}>
          <Icon className={styles.plusIcon} icon="PLUS" />
          <span>Create new collection</span>
        </div>
      );
    } else {
      return (
        <form onSubmit={this.submitNewCollection} className={styles.newCollectionForm}>
          <div className={styles.formControl}>
            <label>{`Name (${title.length} / 100)`}</label>
            <input onChange={this.handleChangeCollectionName} type="text" value={title} />
          </div>

          <div className={styles.formControl}>
            <label>Description(optional)</label>
            <textarea onChange={this.handleChangeCollectionDescription} value={description} />
          </div>

          <div className={styles.actionButtonWrapper}>
            <button className={styles.cancelButton} onClick={this.closeNewCollectionBox} type="button">
              Cancel
            </button>
            {this.getSubmitButton()}
          </div>
        </form>
      );
    }
  };

  private handleChangeCollectionName = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      title: e.currentTarget.value,
    });
  };

  private handleChangeCollectionDescription = (e: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({
      description: e.currentTarget.value,
    });
  };

  private submitNewCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    const { handleSubmitNewCollection } = this.props;
    const { title, description } = this.state;
    e.preventDefault();

    if (title.length === 0) {
      return alertToast({
        type: 'error',
        message: 'Collection name should be more than 1 characters.',
      });
    } else if (title.length > 100) {
      return alertToast({
        type: 'error',
        message: 'Collection name should be less than 100 characters.',
      });
    }

    try {
      await handleSubmitNewCollection({ title, description });

      this.setState({
        title: '',
        description: '',
      });

      if (this.collectionListBox) {
        this.collectionListBox.scrollTop = 0;
      }

      this.closeNewCollectionBox();
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: 'error',
        message: `Failed to make a new collection. ${error.message}`,
      });
    }
  };

  private closeNewCollectionBox = () => {
    this.setState({
      isExpanded: false,
    });
  };

  private handleClickNewCollection = () => {
    this.setState({
      isExpanded: true,
    });
  };

  private getCollectionList = () => {
    const { isLoadingMyCollections, myCollections } = this.props;

    if (isLoadingMyCollections) {
      return (
        <div className={styles.collectionListSpinnerWrapper}>
          <ButtonSpinner size={50} color="#81acff" />
        </div>
      );
    }

    return myCollections.map(collection => {
      return (
        <li
          className={styles.collectionItem}
          onClick={() => {
            this.handleTogglingCollectionList(collection);
          }}
          key={`collection-dropdown-${collection.id}`}
        >
          <Checkbox
            classes={{
              root: styles.checkBox,
              checked: styles.checkedCheckboxIcon,
            }}
            checked={collection.containsSelected}
            value={collection.title}
            color="primary"
          />
          <span className={styles.collectionTitle}>{collection.title}</span>
          <span className={styles.paperCount}>{collection.paperCount}</span>
        </li>
      );
    });
  };

  private handleTogglingCollectionList = (collection: Collection) => {
    const { handleAddingPaperToCollection, handleRemovingPaperFromCollection } = this.props;

    if (collection.containsSelected) {
      handleRemovingPaperFromCollection(collection);
      trackEvent({ category: 'Additional Action', action: 'Remove Paper in Collection', label: `${collection.id}` });
    } else {
      handleAddingPaperToCollection(collection);
      trackEvent({ category: 'Additional Action', action: 'Add Paper to Collection', label: `${collection.id}` });
    }
  };
}

export default withStyles<typeof CollectionDropdown>(styles)(CollectionDropdown);
