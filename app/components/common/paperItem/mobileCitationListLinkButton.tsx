import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import Button from '../../common/button';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { addPaperToRecommendPoolAndOpenDialog } from '../../recommendPool/recommendPoolActions';
import formatNumber from '../../../helpers/formatNumber';

interface Props {
  paperId: number;
  citedCount: number;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const MobileCitationListLinkButton: FC<Props> = ({ paperId, citedCount, pageType, actionArea }) => {
  const dispatch = useDispatch();

  if (!citedCount) return null;

  function handleClickLink() {
    ActionTicketManager.trackTicket({
      pageType,
      actionType: 'fire',
      actionArea: actionArea || pageType,
      actionTag: 'citedList',
      actionLabel: String(paperId),
    });
    dispatch(
      addPaperToRecommendPoolAndOpenDialog({
        pageType,
        actionArea: 'citationButton',
        paperId,
      })
    );
  }

  return (
    <Button
      size="small"
      variant="text"
      color="gray"
      onClick={handleClickLink}
      elementType="link"
      to={{
        pathname: `/papers/${paperId}`,
        hash: 'cited',
      }}
    >
      {`${formatNumber(citedCount)} Citations`}
    </Button>
  );
};

export default MobileCitationListLinkButton;
