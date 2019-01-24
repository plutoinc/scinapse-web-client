import * as React from "react";
import axios from "axios";
import { denormalize } from "normalizr";
import { connect, Dispatch } from "react-redux";
import * as classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import Popper from "@material-ui/core/Popper";
import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import ScinapseButton from "../../components/common/scinapseButton";
import { AppState } from "../../reducers";
import { MyCollectionsState } from "./reducer";
import { collectionSchema, Collection } from "../../model/collection";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import PaperNoteForm from "../../components/paperShow/noteForm";
import {
  selectCollectionToCurrentCollection,
  savePaperToCollection,
  removePaperFromCollection,
  updatePaperNote,
  toggleNoteEditMode,
} from "../../actions/collection";
import { CurrentUser } from "../../model/currentUser";
import {
  closeCollectionDropdown,
  openCollectionDropdown,
  openNoteDropdown,
  closeNoteDropdown,
  getMyCollections,
} from "../../actions/paperShow";
import { trackEvent } from "../../helpers/handleGA";
import ActionTicketManager from "../../helpers/actionTicketManager";
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
  currentUser: CurrentUser;
  collection: Collection | null;
  isLoading: boolean;
  handleUnsignedUser: () => void;
  onClick: () => void;
}

const TitleArea: React.SFC<TitleAreaProps> = props => {
  if (props.isLoading) {
    return (
      <span
        className={classNames({
          [styles.currentCollectionTitle]: true,
          [styles.saved]: props.collection && props.collection.containsSelected,
        })}
        style={{ textAlign: "center" }}
      >
        <CircularProgress disableShrink={true} size={14} thickness={4} />
        <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
      </span>
    );
  }

  if (!props.currentUser.isLoggedIn) {
    return (
      <div className={styles.signInTextWrapper}>
        <span
          onClick={() => {
            props.handleUnsignedUser();
            ActionTicketManager.trackTicket({
              pageType: "paperShow",
              actionType: "fire",
              actionArea: "paperDescription",
              actionTag: "signIn",
              actionLabel: null,
            });
          }}
          className={styles.signInText}
        >
          Sign in
        </span>
        <span>{` and Save the paper in Collection`}</span>
      </div>
    );
  }

  return (
    <span
      className={classNames({
        [styles.currentCollectionTitle]: true,
        [styles.saved]: props.collection && props.collection.containsSelected,
      })}
      onClick={props.onClick}
    >
      {props.collection && props.collection.title}
      <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
    </span>
  );
};

@withStyles<typeof PaperShowCollectionControlButton>(styles)
class PaperShowCollectionControlButton extends React.PureComponent<PaperShowCollectionControlButtonProps> {
  private popoverAnchorEl: HTMLDivElement | null;
  private cancelToken = axios.CancelToken.source();

  public componentDidMount() {
    const { myCollections } = this.props;

    if (myCollections && myCollections.length > 0) {
      const defaultCollection =
        myCollections.find(collection => collection.isDefault) || myCollections[myCollections.length - 1];
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
        myCollections.find(collection => collection.isDefault) || myCollections[myCollections.length - 1];

      this.handleSelectCollection(defaultCollection);
    }
  }

  public render() {
    const { targetPaperId, selectedCollection, currentUser, myCollectionsState, myCollections } = this.props;
    const isLoadingCollection = currentUser.isLoggingIn || myCollectionsState.isLoadingCollections;
    const isSelected = selectedCollection && selectedCollection.containsSelected;
    let saveButtonBorderRadius: string;
    if (currentUser.isLoggedIn) {
      saveButtonBorderRadius = isSelected ? "0" : "0 4px 4px 0";
    } else {
      saveButtonBorderRadius = "4px";
    }

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
          {collection.containsSelected && <Icon icon="BOOKMARK_GRAY" className={styles.bookmarkIcon} />}
        </li>
      ));

    return (
      <div ref={el => (this.popoverAnchorEl = el)} className={styles.buttonWrapper}>
        <li className={styles.actionItem}>
          <ClickAwayListener onClickAway={this.handleCloseCollectionDropdown}>
            <div className={styles.actionItemWrapper}>
              <TitleArea
                currentUser={currentUser}
                collection={selectedCollection}
                isLoading={
                  currentUser.isLoggingIn ||
                  myCollectionsState.isLoadingCollections ||
                  myCollectionsState.isLoadingCollectionsInDropdown
                }
                handleUnsignedUser={this.handleUnsignedUser}
                onClick={this.handleToggleCollectionDropdown}
              />
              <Popper
                open={myCollectionsState.isCollectionDropdownOpen}
                anchorEl={this.popoverAnchorEl!}
                placement="bottom-start"
                disablePortal={true}
                modifiers={{
                  flip: {
                    enabled: false,
                  },
                }}
              >
                <ul className={styles.popperPaper}>
                  <li className={styles.newCollectionWrapper}>
                    <div className={styles.newCollectionItem} onClick={this.handleClickNewCollectionButton}>
                      <Icon icon="SMALL_PLUS" className={styles.plusIcon} />
                      <span className={styles.newCollectionContext}>New Collection</span>
                    </div>
                    <div className={styles.newCollectionCancel} onClick={this.handleCloseCollectionDropdown}>
                      <span className={styles.newCollectionCancelContext}>Cancel</span>
                    </div>
                  </li>
                  {collections}
                </ul>
              </Popper>
            </div>
          </ClickAwayListener>
          <ScinapseButton
            content={this.getSaveButtonContent()}
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "83px",
              height: "40px",
              borderRadius: saveButtonBorderRadius,
              padding: "12px 0",
              backgroundColor: isSelected ? "#34495e" : "#3e7fff",
              fontSize: "16px",
              fontWeight: 500,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            disabled={isLoadingCollection || myCollectionsState.isFetchingPaper}
            onClick={this.handleClickSaveButton}
          />

          <ClickAwayListener onClickAway={this.handleClickNoteBoxBackdrop}>
            <div>
              {isSelected && (
                <ScinapseButton
                  content={this.getNoteButtonContent()}
                  gaCategory="New Paper Show"
                  gaAction="Click memo icon button"
                  gaLabel={targetPaperId.toString()}
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
                  onClick={this.toggleNoteDropdown}
                />
              )}
              <Popper
                anchorEl={this.popoverAnchorEl}
                open={myCollectionsState.isNoteDropdownOpen}
                placement="bottom-end"
                disablePortal={true}
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
          </ClickAwayListener>
        </li>
      </div>
    );
  }

  private handleUnsignedUser = () => {
    GlobalDialogManager.openSignInDialog();
  };

  private getNoteButtonContent = () => {
    const { myCollectionsState, currentUser, selectedCollection } = this.props;

    const isLoading =
      currentUser.isLoggingIn ||
      myCollectionsState.isLoadingCollections ||
      myCollectionsState.isLoadingCollectionsInDropdown ||
      myCollectionsState.isFetchingPaper ||
      myCollectionsState.isPostingNote;

    if (isLoading) {
      return <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />;
    }

    return (
      <div>
        {selectedCollection && selectedCollection.note ? (
          <Icon className={styles.addNoteIcon} icon="NOTED" />
        ) : (
          <Tooltip
            disableFocusListener={true}
            disableTouchListener={true}
            title="Add Memo"
            placement="top"
            classes={{ tooltip: styles.arrowBottomTooltip }}
          >
            <div>
              <Icon className={styles.addNoteIcon} icon="ADD_NOTE" />
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  private getNoteDropdownContent = () => {
    const { myCollectionsState, selectedCollection } = this.props;
    if (myCollectionsState.isNoteEditMode || (selectedCollection && !selectedCollection.note)) {
      return (
        <div className={styles.editNoteBox}>
          <PaperNoteForm
            initialValue={selectedCollection && selectedCollection.note}
            handleCloseDropdown={this.closeNoteDropdown}
            handleSubmit={this.handleSubmitNote}
            isLoading={myCollectionsState.isPostingNote}
          />
        </div>
      );
    } else if (selectedCollection && selectedCollection.note) {
      return (
        <div className={styles.renderNoteBox}>
          <div>{selectedCollection.note}</div>
          <div className={styles.noteButtonWrapper}>
            <span className={styles.noteControlIconWrapper} onClick={this.toggleNoteEditMode}>
              <Icon icon="PEN" className={`${styles.noteControlIcon} ${styles.penIcon}`} />
            </span>
            <span className={styles.noteControlIconWrapper} onClick={this.handleDeleteNote}>
              <Icon icon="TRASH_CAN" className={`${styles.noteControlIcon} ${styles.trashIcon}`} />
            </span>
          </div>
        </div>
      );
    }
    return <div />;
  };

  private handleClickNewCollectionButton = () => {
    GlobalDialogManager.openNewCollectionDialog();
    this.handleCloseCollectionDropdown();
    trackEvent({
      category: "Additional Action",
      action: "Click [New Collection] Button",
      label: "my collection list page",
    });
  };

  private handleDeleteNote = () => {
    const { dispatch, targetPaperId, selectedCollection } = this.props;

    if (confirm("Are you SURE to remove this memo?") && selectedCollection) {
      dispatch(
        updatePaperNote({
          paperId: targetPaperId,
          collectionId: selectedCollection.id,
          note: null,
        })
      );
    }
  };

  private handleSubmitNote = (note: string) => {
    const { dispatch, targetPaperId, selectedCollection } = this.props;

    if (selectedCollection) {
      dispatch(
        updatePaperNote({
          paperId: targetPaperId,
          collectionId: selectedCollection.id,
          note,
        })
      );
    }
  };

  private toggleNoteEditMode = () => {
    const { dispatch } = this.props;

    dispatch(toggleNoteEditMode());
  };

  private toggleNoteDropdown = () => {
    const { dispatch, myCollectionsState, selectedCollection } = this.props;

    if (myCollectionsState.isNoteDropdownOpen) {
      return this.closeNoteDropdown();
    }

    if (selectedCollection && !selectedCollection.note) {
      this.toggleNoteEditMode();
    }
    dispatch(openNoteDropdown());
  };

  private closeNoteDropdown = () => {
    const { dispatch } = this.props;

    dispatch(closeNoteDropdown());
  };

  private handleClickNoteBoxBackdrop = () => {
    const { myCollectionsState } = this.props;

    if (!myCollectionsState.isNoteEditMode) {
      this.closeNoteDropdown();
    }
  };

  private handleSelectCollection = (collection: Collection) => {
    const { dispatch } = this.props;

    dispatch(selectCollectionToCurrentCollection(collection));
  };

  private handleToggleCollectionDropdown = () => {
    const { dispatch, myCollectionsState, targetPaperId } = this.props;

    if (myCollectionsState.isCollectionDropdownOpen) {
      dispatch(closeCollectionDropdown());
    } else {
      dispatch(getMyCollections(targetPaperId, this.cancelToken.token, true));
      dispatch(openCollectionDropdown());
    }
  };

  private handleCloseCollectionDropdown = () => {
    const { dispatch, myCollectionsState } = this.props;

    if (myCollectionsState.isCollectionDropdownOpen) {
      dispatch(closeCollectionDropdown());
    }
  };

  private handleClickSaveButton = () => {
    const { dispatch, selectedCollection, targetPaperId, currentUser } = this.props;

    if (!currentUser.isLoggedIn) {
      trackEvent({
        category: "New Paper Show",
        action: "Click save in collection button (Unsigned user)",
        label: targetPaperId.toString(),
      });

      ActionTicketManager.trackTicket({
        pageType: "paperShow",
        actionType: "fire",
        actionArea: "paperDescription",
        actionTag: "signInViaCollection",
        actionLabel: null,
      });
      return this.handleUnsignedUser();
    }

    if (selectedCollection && targetPaperId && !selectedCollection.containsSelected) {
      trackEvent({
        category: "New Paper Show",
        action: "Click save in collection button",
        label: targetPaperId.toString(),
      });

      ActionTicketManager.trackTicket({
        pageType: "paperShow",
        actionType: "fire",
        actionArea: "paperDescription",
        actionTag: "addToCollection",
        actionLabel: String(targetPaperId),
      });

      dispatch(
        savePaperToCollection({
          collection: selectedCollection,
          paperId: targetPaperId,
        })
      );
    } else if (selectedCollection && targetPaperId && selectedCollection.containsSelected) {
      trackEvent({
        category: "New Paper Show",
        action: "Click saved in collection button",
        label: targetPaperId.toString(),
      });
      ActionTicketManager.trackTicket({
        pageType: "paperShow",
        actionType: "fire",
        actionArea: "paperDescription",
        actionTag: "removeFromCollection",
        actionLabel: String(targetPaperId),
      });
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
      currentUser.isLoggingIn ||
      myCollectionsState.isLoadingCollections ||
      myCollectionsState.isLoadingCollectionsInDropdown ||
      myCollectionsState.isFetchingPaper;

    if (isLoading) {
      return <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} />;
    }

    if (selectedCollection && selectedCollection.containsSelected) {
      return (
        <Tooltip
          disableFocusListener={true}
          disableTouchListener={true}
          title="Remove from Collection"
          placement="top"
          classes={{ tooltip: styles.arrowBottomTooltip }}
        >
          <div>
            <Icon className={styles.saveButtonIcon} icon="BOOKMARK_THIN" />
            <span>Saved</span>
          </div>
        </Tooltip>
      );
    }

    return (
      <Tooltip
        disableFocusListener={true}
        disableTouchListener={true}
        title="Save to Collection"
        placement="top"
        classes={{ tooltip: styles.arrowBottomTooltip }}
      >
        <div>
          <Icon className={styles.saveButtonIcon} icon="BOOKMARK_THIN" />
          <span>Save</span>
        </div>
      </Tooltip>
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
