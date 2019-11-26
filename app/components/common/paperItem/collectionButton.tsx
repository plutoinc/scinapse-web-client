import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { AppState } from '../../../reducers';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
import { Paper } from '../../../model/paper';
import Button from '../button';

interface CollectionButtonProps {
  paper: Paper;
  saved: boolean;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  buttonStyle?: React.CSSProperties;
}

const selectUserHasCollection = createSelector([(state: AppState) => state.myCollections], myCollections => {
  return myCollections.collectionIds && myCollections.collectionIds.length > 0;
});

const CollectionButton: React.FC<CollectionButtonProps> = ({ saved, paper, pageType, actionArea, buttonStyle }) => {
  const dispatch = useDispatch();
  const userHasCollection = useSelector<AppState, boolean>(selectUserHasCollection);

  let buttonContent = 'Save';

  if (saved) {
    buttonContent = 'Saved';
  }

  return (
    <Button
      elementType="button"
      size="small"
      onClick={async () => {
        const action = saved ? 'savedCollection' : 'addToCollection';
        dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'addToCollection' }));
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea,
          actionTag: action,
          actionLabel: String(paper.id),
        });
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: action,
          userActionType: action,
        });

        if (isBlocked) return;

        if (userHasCollection) GlobalDialogManager.openCollectionDialog(paper.id);
        else GlobalDialogManager.openNewCollectionDialog(paper.id);
      }}
      style={saved ? { backgroundColor: '#34495e', borderColor: '#34495e', ...buttonStyle } : { ...buttonStyle }}
    >
      <Icon icon="BOOKMARK" />
      <span>{buttonContent}</span>
    </Button>
  );
};

export default CollectionButton;
