import * as React from 'react';
import axios from 'axios';
import * as store from 'store';
import { denormalize } from 'normalizr';
import { Dispatch } from 'redux';
import { connect, useDispatch } from 'react-redux';
import * as classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';
import ScinapseButton from '../../components/common/scinapseButton';
import { AppState } from '../../reducers';
import { MyCollectionsState } from './reducer';
import { collectionSchema, Collection } from '../../model/collection';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import PaperNoteForm from '../../components/paperShow/noteForm';
import {
  selectCollectionToCurrentCollection,
  savePaperToCollection,
  removePaperFromCollection,
  updatePaperNote,
  toggleNoteEditMode,
} from '../../actions/collection';
import { CurrentUser } from '../../model/currentUser';
import {
  closeCollectionDropdown,
  openCollectionDropdown,
  openNoteDropdown,
  closeNoteDropdown,
  getMyCollections,
} from '../../actions/paperShow';
import { trackEvent } from '../../helpers/handleGA';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { ActionCreators } from '../../actions/actionTypes';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../helpers/checkAuthDialog';
import { addPaperToRecommendPool } from '../../components/recommendOnboardingSnackbar/recommendPoolActions';
const styles = require('./paperShowCollectionControlButton.scss');

const LAST_USER_COLLECTION_ID = 'l_u_c_id';

interface PaperShowCollectionControlButtonProps {
  paperId: number;
  currentUser: CurrentUser;
  myCollectionsState: MyCollectionsState;
  myCollections: Collection[] | null;
  selectedCollection: Collection | null;
  dispatch: Dispatch<any>;
}

interface TitleAreaProps {
  paperId: number;
  currentUser: CurrentUser;
  collection: Collection | null;
  isLoading: boolean;
  onClick: () => void;
}

const TitleArea: React.FC<TitleAreaProps> = props => {
  const dispatch = useDispatch();
  const addToCollectionBtnEl = React.useRef<HTMLDivElement | null>(null);

  if (props.isLoading) {
    return (
      <span
        className={classNames({
          [styles.currentCollectionTitle]: true,
          [styles.saved]: props.collection && props.collection.containsSelected,
        })}
        style={{ textAlign: 'center' }}
      >
        <CircularProgress disableShrink={true} size={14} thickness={4} />
        <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
      </span>
    );
  }

  if (!props.currentUser.isLoggedIn) {
    return (
      <div ref={addToCollectionBtnEl}>
        <button
          onClick={async () => {
            ActionTicketManager.trackTicket({
              pageType: 'paperShow',
              actionType: 'fire',
              actionArea: 'paperDescription',
              actionTag: 'addToCollection',
              actionLabel: null,
            });

            blockUnverifiedUser({
              authLevel: AUTH_LEVEL.VERIFIED,
              actionArea: 'paperDescription',
              actionLabel: 'addToCollection',
              userActionType: 'addToCollection',
            });

            dispatch(addPaperToRecommendPool({ paperId: props.paperId, action: 'addToCollection' }));
          }}
          className={styles.unsignedTitleBtn}
        >
          <Icon icon="COLLECITON_LIST" className={styles.collectionIcon} />
          Add to Collection
        </button>
      </div>
    );
  } else if (!props.collection) {
    return (
      <div className={styles.signInTextWrapper}>
        <span>Save the paper in Collection</span>
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
      this.selectDefaultCollection(myCollections);
    }
  }

  public componentWillReceiveProps(nextProps: PaperShowCollectionControlButtonProps) {
    const { myCollections } = nextProps;

    if (
      (!this.props.myCollections || this.props.myCollections.length === 0) &&
      myCollections &&
      myCollections.length > 0
    ) {
      this.selectDefaultCollection(myCollections);
    }
  }

  public render() {
    const { paperId: targetPaperId, selectedCollection, currentUser, myCollectionsState, myCollections } = this.props;
    const isLoadingCollection = currentUser.isLoggingIn || myCollectionsState.isLoadingCollections;
    const isSelected = selectedCollection && selectedCollection.containsSelected;
    let saveButtonBorderRadius: string;
    if (currentUser.isLoggedIn && (myCollections && myCollections.length > 0)) {
      saveButtonBorderRadius = isSelected ? '0' : '0 4px 4px 0';
    } else {
      saveButtonBorderRadius = '4px';
    }

    const hideSaveBtn = !currentUser.isLoggedIn;

    return (
      <div ref={el => (this.popoverAnchorEl = el)} className={styles.buttonWrapper}>
        <ul>
          <li className={styles.actionItem}>
            {this.getCollectionItemInDropdown()}
            {!hideSaveBtn && (
              <ScinapseButton
                content={this.getSaveButtonContent()}
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: '83px',
                  height: '40px',
                  borderRadius: saveButtonBorderRadius,
                  padding: '12px 0',
                  backgroundColor: isSelected ? '#34495e' : '#3e7fff',
                  fontSize: '16px',
                  fontWeight: 500,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                disabled={isLoadingCollection || myCollectionsState.isFetchingPaper}
                onClick={
                  (myCollections && myCollections.length > 0) || !currentUser.isLoggedIn
                    ? this.handleClickSaveButton
                    : this.handleClickNewCollectionButton
                }
              />
            )}
            <ClickAwayListener onClickAway={this.handleClickNoteBoxBackdrop}>
              <div>
                {isSelected && (
                  <ScinapseButton
                    content={this.getNoteButtonContent()}
                    gaCategory="New Paper Show"
                    gaAction="Click memo icon button"
                    gaLabel={targetPaperId.toString()}
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '0 4px 4px 0',
                      padding: '8px 0',
                      backgroundColor: '#34495e',
                      fontSize: '16px',
                      fontWeight: 500,
                      marginLeft: '1px',
                    }}
                    onClick={this.toggleNoteDropdown}
                  />
                )}
                <Popper
                  anchorEl={this.popoverAnchorEl}
                  open={myCollectionsState.isNoteDropdownOpen}
                  placement="bottom-end"
                  disablePortal
                  modifiers={{ flip: { enabled: false } }}
                  popperOptions={{ positionFixed: true }}
                >
                  <div className={styles.noteBoxWrapper}>{this.getNoteDropdownContent()}</div>
                </Popper>
              </div>
            </ClickAwayListener>
          </li>
        </ul>
      </div>
    );
  }

  private getCollectionItemInDropdown = () => {
    const { selectedCollection, currentUser, myCollectionsState, myCollections, paperId } = this.props;

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
      <ClickAwayListener onClickAway={this.handleCloseCollectionDropdown}>
        <div className={styles.actionItemWrapper}>
          <TitleArea
            currentUser={currentUser}
            paperId={paperId}
            collection={selectedCollection}
            isLoading={
              currentUser.isLoggingIn ||
              myCollectionsState.isLoadingCollections ||
              myCollectionsState.isLoadingCollectionsInDropdown
            }
            onClick={this.handleToggleCollectionDropdown}
          />
          <Popper
            open={myCollectionsState.isCollectionDropdownOpen}
            anchorEl={this.popoverAnchorEl!}
            placement="bottom-start"
            disablePortal
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
    );
  };

  private selectDefaultCollection = (myCollections: Collection[]) => {
    const lastId = parseInt(store.get(LAST_USER_COLLECTION_ID), 10);

    let defaultCollection: Collection;
    defaultCollection =
      myCollections.find(c => c.id === lastId || c.isDefault) || myCollections[myCollections.length - 1];

    this.handleSelectCollection(defaultCollection);
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
            isEdit={myCollectionsState.isNoteEditMode}
            initialValue={selectedCollection && selectedCollection.note}
            onClickCancel={this.closeNoteDropdown}
            onSubmit={this.handleSubmitNote}
            isLoading={myCollectionsState.isPostingNote}
            autoFocus={true}
            textAreaClassName={styles.textarea}
            textareaStyle={{
              border: 0,
              padding: 0,
              borderRadius: '8px',
              fontSize: '14px',
              width: '100%',
              maxHeight: '200px',
            }}
            row={2}
          />
        </div>
      );
    } else if (selectedCollection && selectedCollection.note) {
      return (
        <div className={styles.renderNoteBox}>
          <div className={styles.noteContent}>{selectedCollection.note}</div>
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

  private handleClickNewCollectionButton = async () => {
    const { paperId: targetPaperId } = this.props;

    const isBlocked = await blockUnverifiedUser({
      authLevel: AUTH_LEVEL.VERIFIED,
      actionArea: 'paperDescription',
      actionLabel: 'openNewCollectionDialog',
    });

    trackEvent({
      category: 'Additional Action',
      action: 'Click [New Collection] Button',
      label: 'my collection list page',
    });

    if (!isBlocked) {
      GlobalDialogManager.openNewCollectionDialog(targetPaperId);
    }

    this.handleCloseCollectionDropdown();
  };

  private handleDeleteNote = () => {
    const { dispatch, paperId: targetPaperId, selectedCollection } = this.props;

    if (confirm('Are you SURE to remove this memo?') && selectedCollection) {
      dispatch(
        updatePaperNote({
          paperId: targetPaperId,
          collectionId: selectedCollection.id,
          note: null,
        })
      );
    }
  };

  private handleSubmitNote = async (note: string) => {
    const { dispatch, paperId: targetPaperId, selectedCollection } = this.props;

    if (selectedCollection) {
      await dispatch(
        updatePaperNote({
          paperId: targetPaperId,
          collectionId: selectedCollection.id,
          note,
        })
      );

      dispatch(ActionCreators.closeNoteDropdownInPaperShow());
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

    if (!myCollectionsState.isNoteEditMode && myCollectionsState.isNoteDropdownOpen) {
      this.closeNoteDropdown();
    }
  };

  private handleSelectCollection = (collection: Collection) => {
    const { dispatch } = this.props;

    dispatch(selectCollectionToCurrentCollection(collection));
  };

  private handleToggleCollectionDropdown = () => {
    const { dispatch, myCollectionsState, paperId: targetPaperId } = this.props;

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

  private handleClickSaveButton = async () => {
    const { dispatch, selectedCollection, paperId: targetPaperId } = this.props;
    const isBlocked = await blockUnverifiedUser({
      authLevel: AUTH_LEVEL.VERIFIED,
      actionArea: 'paperDescription',
      actionLabel: 'signInViaCollection',
      userActionType: 'signInViaCollection',
    });

    if (isBlocked) {
      trackEvent({
        category: 'New Paper Show',
        action: 'Click save in collection button (Unsigned user)',
        label: targetPaperId.toString(),
      });

      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'fire',
        actionArea: 'paperDescription',
        actionTag: 'signInViaCollection',
        actionLabel: null,
      });
      dispatch(addPaperToRecommendPool({ paperId: targetPaperId, action: 'addToCollection' }));
      return;
    }

    if (selectedCollection && targetPaperId && !selectedCollection.containsSelected) {
      trackEvent({
        category: 'New Paper Show',
        action: 'Click save in collection button',
        label: targetPaperId.toString(),
      });

      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'fire',
        actionArea: 'paperDescription',
        actionTag: 'addToCollection',
        actionLabel: String(targetPaperId),
      });

      dispatch(
        savePaperToCollection({
          collection: selectedCollection,
          paperId: targetPaperId,
          cancelToken: this.cancelToken.token,
        })
      );
      dispatch(addPaperToRecommendPool({ paperId: targetPaperId, action: 'addToCollection' }));
      store.set(LAST_USER_COLLECTION_ID, selectedCollection.id);
    } else if (selectedCollection && targetPaperId && selectedCollection.containsSelected) {
      trackEvent({
        category: 'New Paper Show',
        action: 'Click saved in collection button',
        label: targetPaperId.toString(),
      });
      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'fire',
        actionArea: 'paperDescription',
        actionTag: 'removeFromCollection',
        actionLabel: String(targetPaperId),
      });
      this.closeNoteDropdown();
      dispatch(
        removePaperFromCollection({
          collection: selectedCollection,
          paperIds: [targetPaperId],
          cancelToken: this.cancelToken.token,
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
    currentUser: appState.currentUser,
    myCollectionsState: appState.myCollections,
    myCollections: denormalize(appState.myCollections.collectionIds, [collectionSchema], appState.entities).filter(
      (collection: Collection) => collection
    ),
    selectedCollection: denormalize(appState.myCollections.selectedCollectionId, collectionSchema, appState.entities),
  };
};

export default connect(mapStateToProps)(PaperShowCollectionControlButton);
