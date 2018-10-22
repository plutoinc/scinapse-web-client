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
// import PlutoAxios from "../../../api/pluto";
const styles = require("./collectionBox.scss");

export interface CollectionBoxProps
  extends Readonly<{
      myCollections: Collection[];
      isLoadingMyCollections: boolean;
      isPositingNewCollection: boolean;
      getMyCollections: () => void;
      handleAddingPaperToCollection: (collection: Collection, note: string) => Promise<void>;
      handleRemovingPaperFromCollection: (collection: Collection) => Promise<void>;
      handleSubmitNewCollection: (params: PostCollectionParams) => Promise<void>;
    }> {}

export interface CollectionBoxStates extends Readonly<{}> {
  isShow: boolean;
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
      isShow: false,
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
    const { collectionNote, isShow, selectedCollectionIndex } = this.state;
    const { myCollections } = this.props;
    console.log(selectedCollectionIndex);
    console.log(myCollections);
    console.log(this.props.isLoadingMyCollections);
    console.log(collectionNote);
    return (
      <div className={styles.fab}>
        <div className={styles.action_notification}>
          <div className={styles.action_notification__save}>
            <span />
          </div>
        </div>
        <div className={styles.action_list}>
          <ul>
            <div className={[styles.collection_list, isShow ? styles.show : null].join(" ")}>
              <div className={styles.collection_list_wrapper}>
                <ul>
                  <li className={styles.create}>+ Create New Collection</li>
                  {this.getCollectionList()}
                </ul>
              </div>
            </div>
            <li className={styles.comment}>
              <button className={styles.open_collection}>
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

  private handleChangeCollectionNote = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      collectionNote: e.currentTarget.value,
    });
  };

  private addToPaper = (index: int) => {
    console.log("addToPaper");
    console.log(this.props.myCollections[index]);
    console.log(this.state.collectionNote);
    this.props.handleAddingPaperToCollection(this.props.myCollections[index], this.state.collectionNote);
    trackEvent({
      category: "Additional Action",
      action: "Add Paper to Collection",
      label: `${this.props.myCollections[index]}`,
    });
  };

  private showCollectionList = () => {
    if (this.state.isShow) this.setState({ isShow: false });
    else this.setState({ isShow: true });
  };

  private getCollectionList = () => {
    const { isLoadingMyCollections, myCollections } = this.props;
    const { isShow } = this.state;

    if (isLoadingMyCollections) {
      return (
        <div className={styles.collectionListSpinnerWrapper}>
          <ButtonSpinner size={50} color="#81acff" />
        </div>
      );
    }
    if (!isShow) {
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
    this.setState({ selectedCollectionIndex: index, isShow: false });
  };
}

export default withStyles<typeof CollectionBox>(styles)(CollectionBox);
