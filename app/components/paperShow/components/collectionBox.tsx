import * as React from "react";
import Icon from "../../../icons";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Collection } from "../../../model/collection";
import { PostCollectionParams } from "../../../api/collection";
import { trackEvent } from "../../../helpers/handleGA";
import { int } from "aws-sdk/clients/datapipeline";
import { PaperInCollection } from "../../../model/paperInCollection";
import { Link } from "react-router-dom";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
const styles = require("./collectionBox.scss");
import * as Cookies from "js-cookie";

export interface CollectionBoxProps
  extends Readonly<{
      myCollections: Collection[];
      papersInCollection: PaperInCollection[];
      isLoadingMyCollections: boolean;
      isPositingNewCollection: boolean;
      paperId: number;
      getMyCollections: () => Promise<void>;
      getPapersInCollection: (collectionId: number) => void;
      handleAddingPaperToCollection: (collection: Collection, note: string) => Promise<void>;
      handleRemovingPaperFromCollection: (collection: Collection) => Promise<void>;
      handleSubmitNewCollection: (params: PostCollectionParams) => Promise<void>;
    }> {}

export interface CollectionBoxStates extends Readonly<{}> {
  isCollectionListShow: boolean;
  isCollectionPaperListShow: boolean;
  isNotificationBoxShow: boolean;
  isCollectionNoteChange: boolean;
  cudAction: string;
  collectionName: string;
  title: string;
  description: string;
  selectedCollectionId: number;
  collectionNote: string;
}

const SELECTED_COLLECTION_ID = "selectedCollectionId";

class CollectionBox extends React.PureComponent<CollectionBoxProps, CollectionBoxStates> {
  public constructor(props: CollectionBoxProps) {
    super(props);
    this.state = {
      isCollectionListShow: false,
      isCollectionPaperListShow: false,
      isNotificationBoxShow: false,
      isCollectionNoteChange: false,
      cudAction: "",
      collectionName: "",
      title: "",
      selectedCollectionId: parseInt(Cookies.get(SELECTED_COLLECTION_ID) || "0", 10),
      description: "",
      collectionNote: "",
    };
  }

  public componentDidMount() {
    this.props.getMyCollections();
  }

  public componentWillUnmount() {
    this.setState({ isNotificationBoxShow: false });
  }
  public render() {
    return <div>{this.getCollectionBox()}</div>;
  }

  private getCollectionBox = () => {
    const {
      isCollectionListShow,
      isCollectionPaperListShow,
      cudAction,
      selectedCollectionId,
      isNotificationBoxShow,
    } = this.state;
    const { myCollections } = this.props;

    const selectedCollection =
      selectedCollectionId === 0 ? myCollections[0] : myCollections.find(obj => obj.id === selectedCollectionId);
    const { papersInCollection } = this.props;
    const currentPaperInCollection = this.getCurrentPaperInCollection();
    const noteInputValue = this.getCurrentCollectionNote(currentPaperInCollection);
    return (
      <div className={styles.fab}>
        <div className={styles.actionNotification}>
          <div className={[styles.actionNotificationSave, isNotificationBoxShow ? styles.show : null].join(" ")}>
            <span className={styles.cudText}>{cudAction}</span>
            {selectedCollection ? (
              <Link
                className={styles.collectionNameLink}
                to={`/collections/${selectedCollectionId}`}
                onClick={() => {
                  trackEvent({ category: "Collection", action: "Click Paper to Collection", label: "" });
                }}
              >
                {`${selectedCollection.title} > `}
              </Link>
            ) : null}
          </div>
        </div>
        <div className={styles.actionList}>
          <ul className={styles.actionItem}>
            <div className={[styles.collectionView, isCollectionPaperListShow ? styles.show : null].join(" ")}>
              {selectedCollection ? (
                <div className={styles.collectionViewWrapper}>
                  <Link
                    to={`/collections/${selectedCollectionId}`}
                    className={styles.collectionViewTitleLink}
                    onClick={() => {
                      trackEvent({ category: "Collection", action: "Click Paper to Collection", label: "" });
                    }}
                  >
                    <h2 className={styles.collectionViewTitle}>{selectedCollection.title}</h2>
                  </Link>
                  <button
                    className={styles.closeBtn}
                    onClick={this.showCollectionPaperList}
                    style={{ width: "15px", height: "15px" }}
                  >
                    <Icon icon="CLOSE_BUTTON" />
                  </button>
                  <div className={styles.collectionViewList}>
                    {papersInCollection.length > 0 ? (
                      <ul className={styles.papers}>{this.getPapersInCollection()}</ul>
                    ) : (
                      <p style={{ textAlign: "center" }}>no paper</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div className={[styles.collectionList, isCollectionListShow ? styles.show : null].join(" ")}>
              <div className={styles.collectionListWrapper}>
                <ul>
                  <li className={styles.create} onClick={this.handleClickNewCollectionButton}>
                    + Create New Collection
                  </li>
                  {this.getCollectionList()}
                </ul>
              </div>
            </div>
            <li className={styles.comment}>
              <button className={styles.openCollectionList} onClick={this.showCollectionList}>
                <Icon icon="LIST" className={styles.listIcon} />
              </button>
              {selectedCollection ? (
                <button className={styles.openCollectionView} onClick={this.showCollectionPaperList}>
                  <Icon icon="COLLECTION" className={styles.collectionIcon} />
                  {selectedCollection.title}
                </button>
              ) : null}
              <input
                type="text"
                onClick={this.disableCollectionListAndCollectionPaper}
                onChange={this.handleChangeCollectionNote}
                onKeyPress={this.handleKeyPressCollectionNote}
                placeholder="Write a memo and save this paper to collection"
                value={noteInputValue}
              />
            </li>
            <li className={styles.cudButton}>{this.showCUDButton(currentPaperInCollection, noteInputValue)}</li>
          </ul>
        </div>
      </div>
    );
  };
  private showCUDButton(currentPaperInCollection: any, inputValue: string) {
    const { myCollections } = this.props;
    const { selectedCollectionId, collectionNote } = this.state;
    if (myCollections && myCollections.length > 0 && currentPaperInCollection) {
      const selectedCollection = myCollections.find(obj => obj.id === selectedCollectionId);
      const note = currentPaperInCollection.note;
      const containsSelected = selectedCollection ? selectedCollection.contains_selected : null;
      if (containsSelected && note === inputValue) {
        return (
          <button className={styles.saveButtonSaved} onClick={() => this.addToPaper(selectedCollectionId, note)}>
            <Icon icon="BOOKMARK" className={styles.saveButtonIcon} />
            <span>SAVED</span>
          </button>
        );
      } else if (containsSelected && note != inputValue && collectionNote.length === 0) {
        return (
          <button className={styles.saveButtonRemove} onClick={() => this.removeToPaper(selectedCollectionId)}>
            <Icon icon="TRASH_CAN" className={styles.saveButtonIcon} />
            <span>REMOVE</span>
          </button>
        );
      } else if (containsSelected && note != collectionNote) {
        return (
          <button
            className={styles.saveButtonChange}
            onClick={() => this.addToPaper(selectedCollectionId, collectionNote)}
          >
            <Icon icon="PEN" className={styles.saveButtonIcon} />
            <span>CHANGE</span>
          </button>
        );
      } else if (!containsSelected) {
        return (
          <button
            className={styles.saveButtonSave}
            onClick={() => this.addToPaper(selectedCollectionId, collectionNote)}
          >
            <Icon icon="BOOKMARK_EMPTY" className={styles.saveButtonIcon} />
            <span>SAVE</span>
          </button>
        );
      }
    }
    return (
      <button className={styles.saveButtonSave} onClick={() => this.addToPaper(selectedCollectionId, collectionNote)}>
        <Icon icon="BOOKMARK_EMPTY" className={styles.saveButtonIcon} />
        <span>SAVE</span>
      </button>
    );
  }
  private getCurrentPaperInCollection() {
    const { myCollections, papersInCollection, paperId } = this.props;
    const { selectedCollectionId } = this.state;
    const selectedCollection = myCollections.find(obj => obj.id === selectedCollectionId);
    const containsSelected = selectedCollection ? selectedCollection.contains_selected : null;
    if (myCollections && containsSelected) {
      return papersInCollection.find(obj => obj.paper_id == paperId) || null;
    }
    return null;
  }

  private getCurrentCollectionNote(currentPaperInCollection: any) {
    const { collectionNote, isCollectionNoteChange } = this.state;
    if (isCollectionNoteChange) return collectionNote;
    if (currentPaperInCollection) {
      return collectionNote || currentPaperInCollection.note;
    }
    return collectionNote;
  }

  private handleClickNewCollectionButton = () => {
    this.setState({ isCollectionListShow: false, isCollectionPaperListShow: false });
    GlobalDialogManager.openNewCollectionDialog();
    trackEvent({
      category: "Additional Action",
      action: "Click [New Collection] Button",
      label: "my collection list page",
    });
  };
  private disableCollectionListAndCollectionPaper = () => {
    this.setState({ isCollectionPaperListShow: false, isCollectionListShow: false });
  };

  private showCollectionPaperList = () => {
    this.setState({ isCollectionPaperListShow: !this.state.isCollectionPaperListShow });
    if (this.state.isCollectionListShow) this.setState({ isCollectionListShow: false });
    if (this.props.myCollections.length > 0) this.props.getPapersInCollection(this.state.selectedCollectionId);
  };

  private showCollectionList = () => {
    const { isCollectionListShow, isCollectionPaperListShow } = this.state;
    this.setState({ isCollectionListShow: !isCollectionListShow });
    if (isCollectionPaperListShow) this.setState({ isCollectionPaperListShow: false });
  };

  private handleChangeCollectionNote = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      collectionNote: e.currentTarget.value,
      isCollectionNoteChange: true,
    });
  };

  private handleKeyPressCollectionNote = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { selectedCollectionId } = this.state;
    if (e.key === "Enter") {
      if (e.currentTarget.value.length === 0) this.removeToPaper(selectedCollectionId);
      else this.addToPaper(selectedCollectionId, e.currentTarget.value);
    }
  };

  private removeToPaper = (collectionId: int) => {
    const selectedCollection = this.props.myCollections.find(obj => obj.id === collectionId);
    if (selectedCollection) {
      this.setState({
        isNotificationBoxShow: true,
        collectionNote: "",
        selectedCollectionId: collectionId,
        isCollectionNoteChange: false,
        cudAction: "REMOVED From",
      });
      setTimeout(
        function() {
          this.setState({ isNotificationBoxShow: false });
        }.bind(this),
        2000
      );

      this.props.handleRemovingPaperFromCollection(selectedCollection);
      trackEvent({
        category: "Remove Action",
        action: "Remove Paper to Collection",
        label: `${selectedCollection}`,
      });
    }
  };
  private addToPaper = (collectionId: int, note: string) => {
    const selectedCollection = this.props.myCollections.find(obj => obj.id === collectionId);
    if (selectedCollection) {
      this.setState({
        isNotificationBoxShow: true,
        collectionNote: note,
        selectedCollectionId: collectionId,
        isCollectionNoteChange: false,
        cudAction: "SAVED to",
      });
      setTimeout(
        function() {
          this.setState({ isNotificationBoxShow: false });
        }.bind(this),
        1500
      );
      this.props.handleAddingPaperToCollection(selectedCollection, note);
      trackEvent({
        category: "Additional Action",
        action: "Add Paper to Collection",
        label: `${selectedCollection}`,
      });
    }
  };

  private getPapersInCollection = () => {
    const { papersInCollection } = this.props;
    const { isCollectionPaperListShow } = this.state;
    if (papersInCollection.length < 0) {
      return (
        <div className={styles.collectionListSpinnerWrapper}>
          <ButtonSpinner size={50} color="#81acff" />
        </div>
      );
    }
    if (!isCollectionPaperListShow) {
      return null;
    } else {
      return papersInCollection.map(paperInCollection => {
        if (paperInCollection) {
          return (
            <li className={styles.CollectionBoxPaperItem} key={paperInCollection.paper_id}>
              <Link
                to={`/papers/${paperInCollection.paper_id}`}
                className={styles.CollectionBoxPaperItemPaperTitle}
                onClick={() => {
                  trackEvent({ category: "Collection", action: "Click Collection to paper", label: "" });
                }}
              >
                <div className={styles.CollectionBoxPaperItemPaper}>
                  <div className={styles.CollectionBoxPaperItemPaperTitle}>{paperInCollection.paper.title}</div>
                  {paperInCollection.paper.journal ? (
                    <div className={styles.CollectionBoxPaperItemPaperJournalAuthors}>
                      {paperInCollection.paper.journal.title}
                    </div>
                  ) : null}
                </div>
              </Link>
              <div className={styles.CollectionBoxPaperItemMemo}>
                <div className={styles.CollectionBoxPaperItemMemoContent}>{paperInCollection.note}</div>
              </div>
            </li>
          );
        }
        return null;
      });
    }
  };
  private getCollectionList = () => {
    const { isLoadingMyCollections, myCollections } = this.props;
    const { isCollectionListShow } = this.state;

    if (isLoadingMyCollections) {
      return (
        <div className={styles.collectionListSpinnerWrapper}>
          <ButtonSpinner size={50} color="#81acff" />
        </div>
      );
    }
    if (!isCollectionListShow) {
      return null;
    } else {
      return myCollections.map(collection => {
        return (
          <li
            className={styles.collectionItem}
            key={`collection-li-${collection.id}`}
            onClick={() => {
              this.selectedCollection(collection.id);
            }}
          >
            {collection.title}
          </li>
        );
      });
    }
  };

  private selectedCollection = (collectionId: int) => {
    this.props.getPapersInCollection(collectionId);
    Cookies.set(SELECTED_COLLECTION_ID, collectionId.toString());
    this.setState({
      selectedCollectionId: collectionId,
      isCollectionNoteChange: false,
      isCollectionListShow: false,
      collectionNote: "",
    });
  };
}

export default withStyles<typeof CollectionBox>(styles)(CollectionBox);
