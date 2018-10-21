import * as React from "react";
// import { Link } from "react-router-dom";
import Icon from "../../../icons";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Collection } from "../../../model/collection";
import { PostCollectionParams } from "../../../api/collection";
// import * as classNames from "classnames";
// import alertToast from "../../../helpers/makePlutoToastAction";
// import { trackEvent } from "../../../helpers/handleGA";
// import PlutoAxios from "../../../api/pluto";
const styles = require("./collectionBox.scss");

export interface CollectionBoxProps
  extends Readonly<{
      myCollections: Collection[];
      isLoadingMyCollections: boolean;
      isPositingNewCollection: boolean;
      getMyCollections: () => void;
      handleAddingPaperToCollection: (collection: Collection) => Promise<void>;
      handleRemovingPaperFromCollection: (collection: Collection) => Promise<void>;
      handleSubmitNewCollection: (params: PostCollectionParams) => Promise<void>;
    }> {}

export interface CollectionBoxStates extends Readonly<{}> {
  isShow: boolean;
  collectionName: string;
  title: string;
  description: string;
  selectedCollection: string;
}

class CollectionBox extends React.PureComponent<CollectionBoxProps, CollectionBoxStates> {
  public constructor(props: CollectionBoxProps) {
    super(props);

    this.state = {
      isShow: false,
      collectionName: "",
      title: "",
      selectedCollection: "",
      description: "",
    };
  }

  public componentDidMount() {
    this.props.getMyCollections();
  }

  public render() {
    return <div>{this.getNewCollectionBox()}</div>;
  }

  private getNewCollectionBox = () => {
    return (
      <div className={styles.fab}>
        <div className={styles.action_notification}>
          <div className={styles.action_notification__save}>
            <span />
          </div>
        </div>
        <div className={styles.action_list}>
          <ul>
            <div className={[styles.collection_list, this.state.isShow ? styles.show : null].join(" ")}>
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
              {this.props.myCollections.length > 0 && this.state.selectedCollection.trim() == "" ? (
                <button onClick={this.showCollectionList}>{this.props.myCollections[0].title}</button>
              ) : (
                <button onClick={this.showCollectionList}>{this.state.selectedCollection}</button>
              )}
              <input type="text" placeholder="Leave your comment and save to collection" value="" />
            </li>
            <li className={styles.save_to_collection}>
              <button className={styles.save}>+ SAVE</button>
            </li>
          </ul>
        </div>
      </div>
    );
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
      return myCollections.map(collection => {
        return (
          <li
            className={styles.collectionItem}
            key={`collection-li-${collection.id}`}
            onClick={() => {
              this.selectedCollection(collection);
            }}
          >
            {collection.title}
          </li>
        );
      });
    }
  };
  private selectedCollection = (collection: Collection) => {
    this.setState({ selectedCollection: collection.title, isShow: false });
  };
}

export default withStyles<typeof CollectionBox>(styles)(CollectionBox);
