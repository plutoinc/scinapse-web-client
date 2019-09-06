import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { AppState } from '../../../reducers';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import { addPaperToRecommendPool } from '../../recommendPool/recommendPoolActions';
import { Paper } from '../../../model/paper';

const styles = require('./collectionButton.scss');

interface CollectionButtonProps {
  paper: Paper;
  saved: boolean;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const selectUserHasCollection = createSelector([(state: AppState) => state.myCollections], myCollections => {
  return myCollections.collectionIds && myCollections.collectionIds.length > 0;
});

const CollectionButton: React.FC<CollectionButtonProps> = ({ saved, paper, pageType, actionArea }) => {
  const dispatch = useDispatch();
  const userHasCollection = useSelector<AppState, boolean>(selectUserHasCollection);

  let buttonContent = 'Save';
  if (saved) {
    buttonContent = 'Saved';
  }

  return (
    <button
      onClick={async () => {
        const actionLabel = saved ? 'addToCollection' : 'savedCollection';
        dispatch(addPaperToRecommendPool(paper.id));
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea,
          actionTag: actionLabel,
          actionLabel: String(paper.id),
        });
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: actionLabel,
          userActionType: actionLabel,
        });
        if (isBlocked) return;

        if (userHasCollection) GlobalDialogManager.openCollectionDialog(paper.id);
        else GlobalDialogManager.openNewCollectionDialog(paper.id);
      }}
      className={classNames({
        [styles.button]: true,
        [styles.savedButton]: saved,
      })}
    >
      <Icon className={styles.bookmarkIcon} icon="BOOKMARK" />
      <span>{buttonContent}</span>
    </button>
  );
};

export default withStyles<typeof CollectionButton>(styles)(CollectionButton);
