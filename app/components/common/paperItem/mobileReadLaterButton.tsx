import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../common/button';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import { AppState } from '../../../reducers';
import Icon from '../../../icons';

interface Props {
  paperId: number;
  saved: boolean;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const MobileReadLaterButton: FC<Props> = ({ paperId, saved, pageType, actionArea }) => {
  const dispatch = useDispatch();
  const userHasCollection = useSelector<AppState, boolean>(state => {
    return state.myCollections.collectionIds && state.myCollections.collectionIds.length > 0;
  });

  return (
    <Button
      elementType="button"
      size="small"
      color={saved ? 'black' : 'blue'}
      onClick={async () => {
        const actionLabel = saved ? 'addToCollection' : 'savedCollection';
        dispatch(addPaperToRecommendPool({ paperId, action: 'addToCollection' }));
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea,
          actionTag: actionLabel,
          actionLabel: String(paperId),
        });
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: actionLabel,
          userActionType: actionLabel,
        });
        if (isBlocked) return;

        if (userHasCollection) GlobalDialogManager.openCollectionDialog(paperId);
        else GlobalDialogManager.openNewCollectionDialog(paperId);
      }}
    >
      <Icon icon="BOOKMARK" />
      <span>Read Later</span>
    </Button>
  );
};

export default MobileReadLaterButton;
