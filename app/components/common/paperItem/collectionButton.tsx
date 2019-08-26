import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { AppState } from '../../../reducers';
import { CurrentUser } from '../../../model/currentUser';
import { Collection, collectionSchema } from '../../../model/collection';
import { MyCollectionsState } from '../../../containers/paperShowCollectionControlButton/reducer';
import CollectionPaperNote from '../../collectionPaperNote';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import { addPaperToRecommendPool } from '../../recommendPool/recommendPoolActions';
const styles = require('./collectionButton.scss');

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    myCollections: state.myCollections,
    collection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities),
  };
}

interface CollectionButtonProps {
  paperId: number;
  paperNote?: string;
  pageType: Scinapse.ActionTicket.PageType;
  hasCollection: boolean;
  currentUser: CurrentUser;
  collection: Collection | undefined;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  onRemove?: (paperId: number) => Promise<void>;
  myCollections: MyCollectionsState;
  dispatch: Dispatch<any>;
}

function handleAddToCollection(myCollections: MyCollectionsState, paperId: number) {
  if (!myCollections.collectionIds || myCollections.collectionIds.length === 0) {
    GlobalDialogManager.openNewCollectionDialog(paperId);
  } else {
    GlobalDialogManager.openCollectionDialog(paperId);
  }
}

function trackActionToClickCollectionButton(
  paperId: number,
  pageType: Scinapse.ActionTicket.PageType,
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType | null
) {
  ActionTicketManager.trackTicket({
    pageType,
    actionType: 'fire',
    actionArea,
    actionTag: 'addToCollection',
    actionLabel: String(paperId),
  });
}

const CollectionButton: React.SFC<CollectionButtonProps> = ({
  paperId,
  pageType,
  paperNote,
  actionArea,
  hasCollection,
  onRemove,
  myCollections,
  currentUser,
  collection,
  dispatch,
}) => {
  const itsMine = collection && collection.createdBy.id === currentUser.id ? true : false;
  const newMemoAnchor = React.useRef<HTMLDivElement | null>(null);
  const [isOpenNotePopover, setIsOpenNotePopover] = React.useState(false);

  if (hasCollection && onRemove && itsMine && collection) {
    return (
      <>
        <button
          className={styles.addCollectionBtnWrapper}
          onClick={() => {
            onRemove(paperId);
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: 'removeFromCollection',
              actionLabel: String(paperId),
            });
          }}
        >
          <Icon className={styles.buttonIcon} icon="TRASH_CAN" />
          <span>Remove from Collection</span>
        </button>
        <div ref={newMemoAnchor}>
          <button
            className={styles.addCollectionNoteBtnWrapper}
            onClick={() => {
              setIsOpenNotePopover(!isOpenNotePopover);
              if (!!paperNote) {
                ActionTicketManager.trackTicket({
                  pageType,
                  actionType: 'fire',
                  actionArea: actionArea || pageType,
                  actionTag: 'viewNote',
                  actionLabel: String(paperId),
                });
              }
            }}
          >
            {paperNote ? (
              <>
                <Icon className={styles.addNoteIcon} icon="NOTED" />View Note
              </>
            ) : (
              <>
                <Icon className={styles.addNoteIcon} icon="ADD_NOTE" /> Add Note
              </>
            )}
          </button>
          <Popover
            open={isOpenNotePopover}
            classes={{ paper: styles.collectionNoteForm }}
            anchorEl={newMemoAnchor.current!}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            onClose={() => {
              setIsOpenNotePopover(false);
            }}
          >
            <CollectionPaperNote
              maxHeight={120}
              note={paperNote}
              collectionId={collection.id}
              paperId={paperId}
              isMine={!!itsMine}
            />
          </Popover>
        </div>
      </>
    );
  }

  return (
    <button
      className={styles.addCollectionBtnWrapper}
      onClick={async () => {
        dispatch(addPaperToRecommendPool(paperId));

        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: 'addToCollection',
          userActionType: 'addToCollection',
        });

        trackActionToClickCollectionButton(paperId, pageType, actionArea || pageType);

        if (!isBlocked) {
          handleAddToCollection(myCollections, paperId);
        }
      }}
    >
      <Icon className={styles.plusIcon} icon="SMALL_PLUS" />
      <span>Add To Collection</span>
    </button>
  );
};

export default connect(mapStateToProps)(withStyles<typeof CollectionButton>(styles)(CollectionButton));
