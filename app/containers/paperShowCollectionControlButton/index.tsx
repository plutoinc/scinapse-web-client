import * as React from "react";
import { denormalize } from "normalizr";
import { connect, Dispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ScinapseButton from "../../components/common/scinapseButton";
import { AppState } from "../../reducers";
import { MyCollectionsState } from "./reducer";
import { collectionSchema, Collection } from "../../model/collection";
import PaperNoteForm from "../../components/paperShow/noteForm";
import {
  selectCollectionToCurrentCollection,
  savePaperToCollection,
  removePaperFromCollection,
} from "../../actions/collection";
import { CurrentUser } from "../../model/currentUser";
import {
  closeCollectionDropdown,
  openCollectionDropdown,
  openNoteDropdown,
  closeNoteDropdown,
} from "../../actions/paperShow";
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

const NoteEditButton: React.SFC<{ onClick: () => void }> = props => {
  return (
    <button className={styles.noteEditButton} type="button" onClick={props.onClick}>
      {props.children}
    </button>
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
            this.handleCloseCollectionDropdown();
          }}
          key={collection.id}
        >
          <span className={styles.collectionTitle}>{collection.title}</span>
          {collection.contains_selected && <Icon icon="BOOKMARK_GRAY" className={styles.bookmarkIcon} />}
        </li>
      ));

    return (
      <div ref={el => (this.popoverAnchorEl = el)} className={styles.buttonWrapper}>
        <li className={styles.actionItem}>
          <TitleArea
            collection={selectedCollection}
            isLoading={currentUser.isLoggingIn || myCollectionsState.isLoadingCollections}
            onClick={this.handleToggleCollectionDropdown}
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
              borderRadius: isSelected ? "0" : "0 4px 4px 09",
              padding: "12px 0",
              backgroundColor: isSelected ? "#34495e" : "#3e7fff",
              fontSize: "16px",
              fontWeight: 500,
            }}
            disabled={isLoadingCollection || myCollectionsState.isFetchingPaper}
            onClick={this.handleClickSaveButton}
          />
          {isSelected && (
            <ScinapseButton
              content={this.getNoteButtonContent()}
              gaCategory="PaperShowCollection"
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "0 4px 4px 0",
                padding: "8px 0",
                backgroundColor: "#34495e",
                fontSize: "16px",
                fontWeight: 500,
                marginLeft: "1px",
              }}
              onClick={this.openNoteDropdown}
            />
          )}
        </li>

        <Popper
          open={myCollectionsState.isCollectionDropdownOpen}
          anchorEl={this.popoverAnchorEl!}
          placement="top-start"
          modifiers={{
            flip: {
              enabled: false,
            },
          }}
          popperOptions={{
            positionFixed: true,
          }}
        >
          <ClickAwayListener onClickAway={this.handleCloseCollectionDropdown}>
            <ul className={styles.popperPaper}>{collections}</ul>
          </ClickAwayListener>
        </Popper>

        <Popper
          anchorEl={this.popoverAnchorEl}
          open={myCollectionsState.isNoteDropdownOpen}
          placement="top-end"
          modifiers={{
            flip: {
              enabled: false,
            },
          }}
          popperOptions={{
            positionFixed: true,
          }}
        >
          <div className={styles.noteBoxWrapper}>{this.getNoteDropdownContent()}</div>
        </Popper>
      </div>
    );
  }

  private getNoteButtonContent = () => {
    const { myCollectionsState, currentUser } = this.props;

    const isLoading =
      currentUser.isLoggingIn || myCollectionsState.isLoadingCollections || myCollectionsState.isFetchingPaper;

    if (isLoading) {
      return <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />;
    }

    return (
      <div>
        <Icon className={styles.addNoteIcon} icon="ADD_NOTE" />
      </div>
    );
  };

  private getNoteDropdownContent = () => {
    const { myCollectionsState, selectedCollection } = this.props;
    if (myCollectionsState.isNoteEditMode || (selectedCollection && !selectedCollection.note)) {
      return (
        <div className={styles.editNoteBox}>
          <PaperNoteForm handleSubmit={this.handleSubmitNote} isLoading={false} />
          <div className={styles.editButtonWrapper}>
            <NoteEditButton onClick={() => {}}>
              <span style={{ color: "#6096ff" }}>Done</span>
            </NoteEditButton>
            <NoteEditButton onClick={this.closeNoteDropdown}>
              <span style={{ color: "#34495e" }}>Cancel</span>
            </NoteEditButton>
          </div>
        </div>
      );
    } else if (selectedCollection && selectedCollection.note) {
      return <div className={styles.renderNoteBox}>{selectedCollection.note}</div>;
    }
    return <div />;
  };

  private handleSubmitNote = (note: string) => {
    console.log(note);
  };

  private openNoteDropdown = () => {
    const { dispatch } = this.props;

    dispatch(openNoteDropdown());
  };

  private closeNoteDropdown = () => {
    const { dispatch } = this.props;

    dispatch(closeNoteDropdown());
  };

  private handleSelectCollection = (collection: Collection) => {
    const { dispatch } = this.props;
    dispatch(selectCollectionToCurrentCollection(collection));
  };

  private handleToggleCollectionDropdown = () => {
    const { dispatch, myCollectionsState } = this.props;

    if (myCollectionsState.isCollectionDropdownOpen) {
      dispatch(closeCollectionDropdown());
    } else {
      dispatch(openCollectionDropdown());
    }
  };

  private handleCloseCollectionDropdown = () => {
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
      this.closeNoteDropdown();
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
