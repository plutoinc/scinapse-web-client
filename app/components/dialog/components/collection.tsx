import * as React from 'react';
import Popover from '@material-ui/core/Popover/Popover';
import * as classNames from 'classnames';
import Axios, { CancelToken } from 'axios';
import {
  PostCollectionParams,
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams,
} from '../../../api/collection';
import Icon from '../../../icons';
import CollectionItem from './collectionItem';
import { withStyles } from '../../../helpers/withStylesHelper';
import alertToast from '../../../helpers/makePlutoToastAction';
import { CurrentUser } from '../../../model/currentUser';
import { Collection } from '../../../model/collection';
const styles = require('./collection.scss');

interface CollectionDialogProps {
  currentUser: CurrentUser;
  myCollections: Collection[];
  collectionDialogPaperId: string;
  getMyCollections: (cancelToken: CancelToken) => void;
  handleCloseDialogRequest: () => void;
  handleSubmitNewCollection: (params: PostCollectionParams) => void;
  handleAddingPaperToCollections: (params: AddPaperToCollectionParams) => Promise<void>;
  handleRemovingPaperFromCollection: (params: RemovePapersFromCollectionParams) => Promise<void>;
}

interface CollectionDialogStates {
  isNewCollectionMenuOpen: boolean;
  collectionName: string;
  description: string;
}

@withStyles<typeof CollectionDialog>(styles)
class CollectionDialog extends React.PureComponent<CollectionDialogProps, CollectionDialogStates> {
  private contentBox: HTMLDivElement | null;
  private newCollectionAnchor: HTMLDivElement | null;
  private cancelToken = Axios.CancelToken.source();

  public constructor(props: CollectionDialogProps) {
    super(props);

    this.state = {
      isNewCollectionMenuOpen: false,
      collectionName: '',
      description: '',
    };
  }

  public async componentDidMount() {
    this.props.getMyCollections(this.cancelToken.token);
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { handleCloseDialogRequest } = this.props;
    const { isNewCollectionMenuOpen, collectionName, description } = this.state;

    return (
      <div className={styles.dialogWrapper}>
        <div onClick={handleCloseDialogRequest} className={styles.closeButton}>
          <Icon className={styles.closeIcon} icon="X_BUTTON" />
        </div>
        <div className={styles.dialogHeader}>Add this paper to the collections</div>
        <div ref={el => (this.contentBox = el)} className={styles.contentBox}>
          <ul className={styles.collectionListWrapper}>{this.getCollectionItems()}</ul>
        </div>

        <div className={styles.dialogFooter}>
          <div
            ref={el => (this.newCollectionAnchor = el)}
            onClick={this.handleRequestOpenNewCollectionMenu}
            className={classNames({
              [`${styles.newCollectionButtonWrapper}`]: true,
              [`${styles.opened}`]: isNewCollectionMenuOpen,
            })}
          >
            <Icon className={styles.plusIcon} icon="PLUS" />
            <button>Create New Collection</button>
          </div>
          <Popover
            open={isNewCollectionMenuOpen}
            anchorEl={this.newCollectionAnchor!}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            onClose={this.handleRequestCloseNewCollectionMenu}
          >
            <form onSubmit={this.submitNewCollection} className={styles.newCollectionForm}>
              <div className={styles.formControl}>
                <label>Name</label>
                <input onChange={this.handleChangeCollectionName} type="text" value={collectionName} />
              </div>

              <div className={styles.formControl}>
                <label>Description (optional)</label>
                <textarea onChange={this.handleChangeCollectionDescription} value={description} />
              </div>

              <div className={styles.submitBtnWrapper}>
                <button type="submit">Create</button>
              </div>
            </form>
          </Popover>

          <div className={styles.rightBox}>
            <button onClick={handleCloseDialogRequest} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleCloseDialogRequest} className={styles.nextButton}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  private getCollectionItems = () => {
    const {
      myCollections,
      collectionDialogPaperId,
      handleAddingPaperToCollections,
      handleRemovingPaperFromCollection,
    } = this.props;

    return (
      myCollections &&
      myCollections.map(collection => {
        return (
          <CollectionItem
            key={`collection_item_${collection.id}`}
            collection={collection}
            collectionDialogPaperId={collectionDialogPaperId}
            handleAddingPaperToCollections={handleAddingPaperToCollections}
            handleRemovingPaperFromCollection={handleRemovingPaperFromCollection}
          />
        );
      })
    );
  };

  private handleChangeCollectionName = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      collectionName: e.currentTarget.value,
    });
  };

  private handleChangeCollectionDescription = (e: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({
      description: e.currentTarget.value,
    });
  };

  private submitNewCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    const { handleSubmitNewCollection } = this.props;
    const { collectionName, description } = this.state;
    e.preventDefault();

    if (collectionName.length === 0) {
      return alertToast({
        type: 'error',
        message: 'collection name should be more than 1 character.',
      });
    } else if (collectionName.length > 60) {
      return alertToast({
        type: 'error',
        message: 'collection name should be less than 60 character.',
      });
    } else if (description && description.length > 500) {
      return alertToast({
        type: 'error',
        message: 'description should be less than 500 character.',
      });
    }

    try {
      await handleSubmitNewCollection({
        title: collectionName,
        description,
      });

      this.setState({
        collectionName: '',
        description: '',
      });

      if (this.contentBox) {
        this.contentBox.scrollTop = 0;
      }
      this.handleRequestCloseNewCollectionMenu();
    } catch (err) {
      alertToast({
        type: 'error',
        message: `Failed to make a new collection. ${err}`,
      });
    }
  };

  private handleRequestOpenNewCollectionMenu = () => {
    this.setState({
      isNewCollectionMenuOpen: true,
    });
  };

  private handleRequestCloseNewCollectionMenu = () => {
    this.setState({
      isNewCollectionMenuOpen: false,
    });
  };
}
export default CollectionDialog;
