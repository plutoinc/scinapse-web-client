import * as React from "react";
import Popover from "@material-ui/core/Popover/Popover";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./collection.scss");

interface CollectionModalProps {
  handleCloseDialogRequest: () => void;
}

interface CollectionModalStates {
  isNewCollectionMenuOpen: boolean;
  collectionName: string;
  description: string;
}

@withStyles<typeof CollectionModal>(styles)
class CollectionModal extends React.PureComponent<
  CollectionModalProps,
  CollectionModalStates
> {
  private newCollectionAnchor: HTMLDivElement | null;

  public constructor(props: CollectionModalProps) {
    super(props);

    this.state = {
      isNewCollectionMenuOpen: false,
      collectionName: "",
      description: ""
    };
  }

  public render() {
    const { handleCloseDialogRequest } = this.props;
    const { isNewCollectionMenuOpen, collectionName, description } = this.state;

    return (
      <div className={styles.modalWrapper}>
        <div onClick={handleCloseDialogRequest} className={styles.closeButton}>
          <Icon className={styles.closeIcon} icon="X_BUTTON" />
        </div>
        <div className={styles.modalHeader}>
          Add this paper to the collections
        </div>
        <div className={styles.contentBox}>
          <ul className={styles.collectionListWrapper}>
            <li className={styles.collectionItem}>
              <div className={styles.collectionTitle}>Collection Item</div>
              <div className={styles.paperCount}># papers</div>
            </li>
            <li className={styles.collectionItem}>
              <div className={styles.collectionTitle}>Collection Item</div>
              <div className={styles.paperCount}># papers</div>
            </li>
            <li className={styles.collectionItem}>
              <div className={styles.collectionTitle}>Collection Item</div>
              <div className={styles.paperCount}># papers</div>
            </li>
            <li className={styles.collectionItem}>
              <div className={styles.collectionTitle}>Collection Item</div>
              <div className={styles.paperCount}># papers</div>
            </li>
          </ul>
        </div>

        <div className={styles.modalFooter}>
          <div
            ref={el => (this.newCollectionAnchor = el)}
            className={styles.newCollectionButtonWrapper}
            onClick={this.handleRequestOpenNewCollectionMenu}
          >
            <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
            <button>Create new collection</button>
          </div>
          <Popover
            open={isNewCollectionMenuOpen}
            anchorEl={this.newCollectionAnchor!}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            onClose={this.handleRequestCloseNewCollectionMenu}
          >
            <form
              onSubmit={this.submitNewCollection}
              className={styles.newCollectionForm}
            >
              <div className={styles.formControl}>
                <label>Name</label>
                <input
                  onChange={this.handleChangeCollectionName}
                  type="text"
                  value={collectionName}
                />
              </div>

              <div className={styles.formControl}>
                <label>Description (optional)</label>
                <textarea
                  onChange={this.handleChangeCollectionDescription}
                  value={description}
                />
              </div>

              <div className={styles.submitBtnWrapper}>
                <button type="submit">Create</button>
              </div>
            </form>
          </Popover>

          <div className={styles.rightBox}>
            <button className={styles.cancelButton}>Cancel</button>
            <button className={styles.nextButton}>Next</button>
          </div>
        </div>
      </div>
    );
  }

  private handleChangeCollectionName = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    this.setState({
      collectionName: e.currentTarget.value
    });
  };

  private handleChangeCollectionDescription = (
    e: React.FormEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      description: e.currentTarget.value
    });
  };

  private submitNewCollection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Make API
  };

  private handleRequestOpenNewCollectionMenu = () => {
    this.setState({
      isNewCollectionMenuOpen: true
    });
  };

  private handleRequestCloseNewCollectionMenu = () => {
    this.setState({
      isNewCollectionMenuOpen: false
    });
  };
}
export default CollectionModal;
