import * as React from "react";
// import { Link } from "react-router-dom";
import Icon from "../../../icons";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Collection } from "../../../model/collection";
import { PostCollectionParams } from "../../../api/collection";
// import * as classNames from "classnames";
// import alertToast from "../../../helpers/makePlutoToastAction";
import { trackEvent } from "../../../helpers/handleGA";
import { int } from "aws-sdk/clients/datapipeline";
import { PaperInCollection } from "../../../model/paperInCollection";
// import PlutoAxios from "../../../api/pluto";
const styles = require("./collectionBox.scss");

export interface CollectionBoxProps
  extends Readonly<{
      myCollections: Collection[];
      papersInCollection: PaperInCollection[];
      isLoadingMyCollections: boolean;
      isPositingNewCollection: boolean;
      getMyCollections: () => void;
      getPapersInCollection: (collectionId: number) => void;
      handleAddingPaperToCollection: (collection: Collection, note: string) => Promise<void>;
      handleRemovingPaperFromCollection: (collection: Collection) => Promise<void>;
      handleSubmitNewCollection: (params: PostCollectionParams) => Promise<void>;
    }> {}

export interface CollectionBoxStates extends Readonly<{}> {
  isCollectionListShow: boolean;
  isCollectionPaperListShow: boolean;
  collectionName: string;
  title: string;
  description: string;
  selectedCollectionIndex: number;
  collectionNote: string;
}

class CollectionBox extends React.PureComponent<CollectionBoxProps, CollectionBoxStates> {
  public constructor(props: CollectionBoxProps) {
    super(props);

    this.state = {
      isCollectionListShow: false,
      isCollectionPaperListShow: false,
      collectionName: "",
      title: "",
      selectedCollectionIndex: 0,
      description: "",
      collectionNote: "",
    };
  }

  public componentDidMount() {
    this.props.getMyCollections();
  }

  public render() {
    return <div>{this.getCollectionBox()}</div>;
  }

  private getCollectionBox = () => {
    const { collectionNote, isCollectionListShow, isCollectionPaperListShow, selectedCollectionIndex } = this.state;
    const { myCollections } = this.props;
    return (
      <div className={styles.fab}>
        <div className={styles.action_notification}>
          <div className={styles.action_notification__save}>
            <span />
          </div>
        </div>
        <div className={styles.action_list}>
          <ul>
            <div className={[styles.collection_view, isCollectionPaperListShow ? styles.show : null].join(" ")}>
              <div className={styles.collection_view__wrapper}>
                {myCollections.length > 0 ? (
                  <h2 className={styles.collection_view__title}>{myCollections[selectedCollectionIndex].title}</h2>
                ) : null}
                <button className={styles.close_button}>
                  <Icon icon="CLOSE_BUTTON" />
                </button>
                <div className={styles.collection_view__list}>
                  <ul className={styles.papers}>{this.getPapersInCollection()}</ul>
                </div>
              </div>
            </div>
            <div className={[styles.collection_list, isCollectionListShow ? styles.show : null].join(" ")}>
              <div className={styles.collection_list_wrapper}>
                <ul>
                  <li className={styles.create}>+ Create New Collection</li>
                  {this.getCollectionList()}
                </ul>
              </div>
            </div>
            <li className={styles.comment}>
              <button className={styles.open_collection} onClick={this.showCollectionPaperList}>
                <Icon icon="COLLECTION_BOX" />
              </button>
              {myCollections.length > 0 ? (
                <button onClick={this.showCollectionList}>{myCollections[selectedCollectionIndex].title}</button>
              ) : null}
              <input
                type="text"
                onChange={this.handleChangeCollectionNote}
                placeholder="Leave your comment and save to collection"
                value={collectionNote}
              />
            </li>
            <li className={styles.save_to_collection}>
              <button className={styles.save} onClick={() => this.addToPaper(this.state.selectedCollectionIndex)}>
                + SAVE
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  private showCollectionPaperList = () => {
    if (this.state.isCollectionPaperListShow) this.setState({ isCollectionPaperListShow: false });
    else {
      if (this.props.myCollections.length > 0)
        this.props.getPapersInCollection(this.props.myCollections[this.state.selectedCollectionIndex].id);
      this.setState({ isCollectionPaperListShow: true, isCollectionListShow: false });
    }
  };

  private handleChangeCollectionNote = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      collectionNote: e.currentTarget.value,
    });
  };

  private addToPaper = (index: int) => {
    this.props.handleAddingPaperToCollection(this.props.myCollections[index], this.state.collectionNote);
    trackEvent({
      category: "Additional Action",
      action: "Add Paper to Collection",
      label: `${this.props.myCollections[index]}`,
    });
  };

  private showCollectionList = () => {
    if (this.state.isCollectionListShow) this.setState({ isCollectionListShow: false });
    else this.setState({ isCollectionListShow: true, isCollectionPaperListShow: false });
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
              <div className={styles.paper_item_a__paper}>
                <div className={styles.paper_item_a__paper__title}>{paperInCollection.paper.title}</div>
                {/*<div className={styles.paper_item_a__paper__journal_authors}>{paperInCollection.paper.journal}*/}
                {/*</div>*/}
              </div>
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
      return myCollections.map((collection, index) => {
        return (
          <li
            className={styles.collectionItem}
            key={`collection-li-${collection.id}`}
            onClick={() => {
              this.selectedCollection(index);
            }}
          >
            {collection.title}
          </li>
        );
      });
    }
  };

  private selectedCollection = (index: int) => {
    this.props.getPapersInCollection(this.props.myCollections[index].id);
    this.setState({ selectedCollectionIndex: index, isCollectionListShow: false });
  };
}

export default withStyles<typeof CollectionBox>(styles)(CollectionBox);
