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
  selectedCollectionIndex: number;
  collectionNote: string;
}

const SELECTED_COLLECTION_INDEX = "selectedCollectionIndex";

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
      selectedCollectionIndex: Number(Cookies.get(SELECTED_COLLECTION_INDEX)) || 0,
      description: "",
      collectionNote: "",
    };
  }

  public componentDidMount() {
    this.props.getMyCollections();
  }
  componentWillUnmount() {
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
      selectedCollectionIndex,
      isNotificationBoxShow,
    } = this.state;
    const { papersInCollection } = this.props;
    const myCollections = this.props.myCollections.sort((a, b) => b.id - a.id);
    const currentPaperInCollection = this.getCurrentPaperInCollection();
    const noteInputValue = this.getCurrentCollectionNote(currentPaperInCollection);
    return (
      <div className={styles.fab}>
        <div className={styles.action_notification}>
          <div className={[styles.action_notification__save, isNotificationBoxShow ? styles.show : null].join(" ")}>
            <span>{cudAction}</span>
            {myCollections.length > 0 ? (
              <Link
                to={`/collections/${myCollections[selectedCollectionIndex].id}`}
                onClick={() => {
                  trackEvent({ category: "Collection", action: "Click Collection", label: "" });
                }}
              >
                {`${myCollections[selectedCollectionIndex].title} > `}
              </Link>
            ) : null}
          </div>
        </div>
        <div className={styles.action_list}>
          <ul>
            <div className={[styles.collection_view, isCollectionPaperListShow ? styles.show : null].join(" ")}>
              {myCollections.length > 0 && papersInCollection.length > 0 ? (
                <div className={styles.collection_view__wrapper}>
                  <h2 className={styles.collection_view__title}>{myCollections[selectedCollectionIndex].title}</h2>
                  <button
                    className={styles.close_button}
                    onClick={this.showCollectionPaperList}
                    style={{ width: "15px", height: "15px" }}
                  >
                    <Icon icon="CLOSE_BUTTON" />
                  </button>
                  <div className={styles.collection_view__list}>
                    <ul className={styles.papers}>{this.getPapersInCollection()}</ul>
                  </div>
                </div>
              ) : null}
            </div>
            <div className={[styles.collection_list, isCollectionListShow ? styles.show : null].join(" ")}>
              <div className={styles.collection_list_wrapper}>
                <ul>
                  <li className={styles.create} onClick={this.handleClickNewCollectionButton}>
                    + Create New Collection
                  </li>
                  {this.getCollectionList()}
                </ul>
              </div>
            </div>
            <li className={styles.comment}>
              <button className={styles.open_collection} onClick={this.showCollectionList}>
                <Icon icon="LIST" />
              </button>
              {myCollections.length > 0 ? (
                <button onClick={this.showCollectionPaperList}>{myCollections[selectedCollectionIndex].title}</button>
              ) : null}
              <input
                type="text"
                onClick={this.disableCollectionListAndCollectionPaper}
                onChange={this.handleChangeCollectionNote}
                placeholder="Leave your comment and save to collection"
                value={noteInputValue}
              />
            </li>
            <li className={styles.save_to_collection}>
              {this.showCUDButton(currentPaperInCollection, noteInputValue)}
            </li>
          </ul>
        </div>
      </div>
    );
  };
  private showCUDButton(currentPaperInCollection: any, inputValue: string) {
    const { myCollections } = this.props;
    const { selectedCollectionIndex, collectionNote } = this.state;
    if (myCollections && myCollections.length > 0 && currentPaperInCollection) {
      const note = currentPaperInCollection.note;
      const containsSelected = myCollections[selectedCollectionIndex].contains_selected;
      if ((containsSelected && note === collectionNote) || note === inputValue) {
        return (
          <button className={styles.save} onClick={() => this.addToPaper(this.state.selectedCollectionIndex)}>
            <Icon icon="BOOKMARK_EMPTY" className={styles.saveButtonIcon} />
            <span>SAVED</span>
          </button>
        );
      } else if (containsSelected && note != inputValue && collectionNote.length === 0) {
        return (
          <button className={styles.save} onClick={() => this.removeToPaper(this.state.selectedCollectionIndex)}>
            <Icon icon="TRASH_CAN" className={styles.saveButtonIcon} />
            <span>REMOVE</span>
          </button>
        );
      } else if ((containsSelected && note == inputValue) || collectionNote.length > 0) {
        return (
          <button className={styles.save} onClick={() => this.addToPaper(this.state.selectedCollectionIndex)}>
            <Icon icon="PEN" className={styles.saveButtonIcon} />
            <span>CHANGE</span>
          </button>
        );
      } else if (!containsSelected) {
        return (
          <button className={styles.save} onClick={() => this.addToPaper(this.state.selectedCollectionIndex)}>
            <Icon icon="BOOKMARK_EMPTY" className={styles.saveButtonIcon} />
            <span>SAVE</span>
          </button>
        );
      }
    }
    return null;
  }
  private getCurrentPaperInCollection() {
    const { myCollections, papersInCollection } = this.props;
    const { selectedCollectionIndex } = this.state;
    if (myCollections.length > 0 && myCollections[selectedCollectionIndex].contains_selected) {
      return papersInCollection.find(obj => obj.collection_id == myCollections[selectedCollectionIndex].id) || null;
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
    if (this.props.myCollections.length > 0)
      this.props.getPapersInCollection(this.props.myCollections[this.state.selectedCollectionIndex].id);
  };

  private showCollectionList = () => {
    this.setState({ isCollectionListShow: !this.state.isCollectionListShow });
    if (this.state.isCollectionPaperListShow) this.setState({ isCollectionPaperListShow: false });
  };

  private handleChangeCollectionNote = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      collectionNote: e.currentTarget.value,
      isCollectionNoteChange: true,
    });
  };
  private removeToPaper = (index: int) => {
    this.setState({ isNotificationBoxShow: true });
    setTimeout(
      function() {
        this.setState({ isNotificationBoxShow: false });
      }.bind(this),
      1500
    );
    this.setState({ selectedCollectionIndex: index, isCollectionNoteChange: false, cudAction: "REMOVED From" });
    trackEvent({
      category: "Remove Action",
      action: "Remove Paper to Collection",
      label: `${this.props.myCollections[index]}`,
    });
  };
  private addToPaper = (index: int) => {
    this.setState({ isNotificationBoxShow: true });
    setTimeout(
      function() {
        this.setState({ isNotificationBoxShow: false });
      }.bind(this),
      1500
    );
    this.setState({ selectedCollectionIndex: index, isCollectionNoteChange: false, cudAction: "SAVED to" });
    this.props.handleAddingPaperToCollection(this.props.myCollections[index], this.state.collectionNote);
    trackEvent({
      category: "Additional Action",
      action: "Add Paper to Collection",
      label: `${this.props.myCollections[index]}`,
    });
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
            <li className={styles.paper_item_a} key={paperInCollection.paper_id}>
              <Link
                to={`/papers/${paperInCollection.paper_id}`}
                className={styles.paper_item_a__paper__title}
                onClick={() => {
                  trackEvent({ category: "Collection", action: "Click Collection to paper", label: "" });
                }}
              >
                <div className={styles.paper_item_a__paper}>
                  <div className={styles.paper_item_a__paper__title}>{paperInCollection.paper.title}</div>
                  {paperInCollection.paper.journal ? (
                    <div className={styles.paper_item_a__paper__journal_authors}>
                      {paperInCollection.paper.journal.title}>
                    </div>
                  ) : null}
                </div>
              </Link>
              <div className={styles.paper_item_a__memo}>
                <div className={styles.paper_item_a__memo__content}>{paperInCollection.note}</div>
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
      return myCollections.sort((a, b) => b.id - a.id).map((collection, index) => {
        return (
          <li
            className={styles.collectionItem}
            key={`collection-li-${collection.id}`}
            onClick={() => {
              this.selectedCollection(index);
            }}
          >
            {index}-{collection.title}
          </li>
        );
      });
    }
  };

  private selectedCollection = (index: int) => {
    this.props.getPapersInCollection(this.props.myCollections[index].id);
    Cookies.set(SELECTED_COLLECTION_INDEX, index.toString());
    this.setState({
      selectedCollectionIndex: index,
      isCollectionNoteChange: false,
      isCollectionListShow: false,
      collectionNote: "",
    });
  };
}

export default withStyles<typeof CollectionBox>(styles)(CollectionBox);
