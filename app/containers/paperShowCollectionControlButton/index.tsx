import * as React from "react";
import { denormalize } from "normalizr";
import { connect, Dispatch } from "react-redux";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ScinapseButton from "../../components/common/scinapseButton";
import { AppState } from "../../reducers";
import { MyCollectionsState } from "./reducer";
import { collectionSchema, Collection } from "../../model/collection";
import {
  selectCollectionToCurrentCollection,
  savePaperToCollection,
  removePaperFromCollection,
  openCollectionDropdown,
  closeCollectionDropdown,
} from "../../actions/collection";
import { CurrentUser } from "../../model/currentUser";
import CircularProgress from "@material-ui/core/CircularProgress";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
const styles = require("./paperShowCollectionControlButton.scss");

interface PaperShowCollectionControlButtonProps {
  targetPaperId: number;
  currentUser: CurrentUser;
  myCollectionsState: MyCollectionsState;
  myCollections: Collection[] | null;
  selectedCollection: Collection | null;
  dispatch: Dispatch<any>;
}

interface TitleAreaProps {
  collection: Collection | null;
  isLoading: boolean;
  onClick: () => void;
}

const TitleArea: React.SFC<TitleAreaProps> = props => {
  if (props.isLoading) {
    return (
      <span className={styles.currentCollectionTitle} style={{ textAlign: "center" }}>
        <CircularProgress disableShrink={true} size={14} thickness={4} />
        <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
      </span>
    );
  }

  return (
    <span onClick={props.onClick} className={styles.currentCollectionTitle}>
      {props.collection && props.collection.title}
      <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
    </span>
  );
};

@withStyles<typeof PaperShowCollectionControlButton>(styles)
class PaperShowCollectionControlButton extends React.PureComponent<PaperShowCollectionControlButtonProps> {
  private popoverAnchorEl: HTMLDivElement | null;

  public componentDidMount() {
    const { myCollections } = this.props;

    if (myCollections && myCollections.length > 0) {
      const defaultCollection =
        myCollections.find(collection => collection.is_default) || myCollections[myCollections.length - 1];
      this.handleSelectCollection(defaultCollection);
    }
  }

  public componentWillReceiveProps(nextProps: PaperShowCollectionControlButtonProps) {
    const { myCollections } = nextProps;

    if (
      (!this.props.myCollections || this.props.myCollections.length === 0) &&
      myCollections &&
      myCollections.length > 0
    ) {
      const defaultCollection =
        myCollections.find(collection => collection.is_default) || myCollections[myCollections.length - 1];
      this.handleSelectCollection(defaultCollection);
    }
  }

  public render() {
    const { selectedCollection, currentUser, myCollectionsState, myCollections } = this.props;
    const isLoadingCollection = currentUser.isLoggingIn || myCollectionsState.isLoadingCollections;
    const isSelected = selectedCollection && selectedCollection.contains_selected;

    const collections =
      myCollections &&
      myCollections.length > 0 &&
      myCollections.map(collection => (
        <li
          className={styles.collectionItem}
          onClick={() => {
            this.handleSelectCollection(collection);
            this.handleCloseDropdown();
          }}
          key={collection.id}
        >
          <span className={styles.collectionTitle}>{collection.title}</span>
          {collection.contains_selected && <Icon icon="BOOKMARK" className={styles.bookmarkIcon} />}
        </li>
      ));

    return (
      <div ref={el => (this.popoverAnchorEl = el)} className={styles.buttonWrapper}>
        <li className={styles.actionItem}>
          <TitleArea
            collection={selectedCollection}
            isLoading={currentUser.isLoggingIn || myCollectionsState.isLoadingCollections}
            onClick={this.handleOpenDropdown}
          />
          <ScinapseButton
            content={this.getSaveButtonContent()}
            gaCategory="PaperShowCollection"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "83px",
              height: "40px",
              borderRadius: "4px",
              padding: "12px 0",
              backgroundColor: isSelected ? "#34495e" : "#3e7fff",
              fontSize: "16px",
              fontWeight: 500,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            disabled={isLoadingCollection || myCollectionsState.isFetchingPaper}
            onClick={this.handleClickSaveButton}
          />
        </li>

        <Popper open={myCollectionsState.isCollectionDropdownOpen} anchorEl={this.popoverAnchorEl!} placement="top-end">
          <ClickAwayListener onClickAway={this.handleCloseDropdown}>
            <ul className={styles.popperPaper}>{collections}</ul>
          </ClickAwayListener>
        </Popper>
      </div>
    );
  }

  private handleSelectCollection = (collection: Collection) => {
    const { dispatch } = this.props;
    dispatch(selectCollectionToCurrentCollection(collection));
  };

  private handleOpenDropdown = () => {
    const { dispatch } = this.props;

    dispatch(openCollectionDropdown());
  };

  private handleCloseDropdown = () => {
    const { dispatch } = this.props;

    dispatch(closeCollectionDropdown());
  };

  private handleClickSaveButton = () => {
    const { dispatch, selectedCollection, targetPaperId } = this.props;

    if (selectedCollection && targetPaperId && !selectedCollection.contains_selected) {
      dispatch(
        savePaperToCollection({
          collection: selectedCollection,
          paperId: targetPaperId,
        })
      );
    } else if (selectedCollection && targetPaperId && selectedCollection.contains_selected) {
      dispatch(
        removePaperFromCollection({
          collection: selectedCollection,
          paperIds: [targetPaperId],
        })
      );
    }
  };

  private getSaveButtonContent = () => {
    const { currentUser, myCollectionsState, selectedCollection } = this.props;
    const isLoading =
      currentUser.isLoggingIn || myCollectionsState.isLoadingCollections || myCollectionsState.isFetchingPaper;

    if (isLoading) {
      return <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />;
    }

    if (selectedCollection && selectedCollection.contains_selected) {
      return (
        <div>
          <Icon className={styles.saveButtonIcon} icon={"BOOKMARK_GRAY"} />
          <span>Saved</span>
        </div>
      );
    }

    return (
      <div>
        <Icon className={styles.saveButtonIcon} icon={"BOOKMARK_GRAY"} />
        <span>Save</span>
      </div>
    );
  };
}

const mapStateToProps = (appState: AppState) => {
  return {
    targetPaperId: appState.paperShow.paperId,
    currentUser: appState.currentUser,
    myCollectionsState: appState.myCollections,
    myCollections: denormalize(appState.myCollections.collectionIds, [collectionSchema], appState.entities),
    selectedCollection: denormalize(appState.myCollections.selectedCollectionId, collectionSchema, appState.entities),
  };
};

export default connect(mapStateToProps)(PaperShowCollectionControlButton);
