import React from 'react';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import formatNumber from '../../../helpers/formatNumber';
import { Paper } from '../../../model/paper';
import Button from '../button';

interface CitationListLinkButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const CitationListLinkButton: React.FC<CitationListLinkButtonProps> = ({ paper, actionArea, pageType }) => {
  if (!paper.citedCount) return null;

  return (
    <Button
      elementType="link"
      to={{
        pathname: `/papers/${paper.id}`,
        hash: 'cited',
      }}
      size="small"
      color="black"
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea: actionArea || pageType,
          actionTag: 'citedList',
          actionLabel: String(paper.id),
        });
      }}
    >
      <span>{`${formatNumber(paper.citedCount)} Citations`}</span>
    </Button>
  );
};

export default CitationListLinkButton;
