import React from 'react';
import { Link } from 'react-router-dom';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import formatNumber from '../../../helpers/formatNumber';
import { Paper } from '../../../model/paper';

interface CitationListLinkButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className: string;
}

const CitationListLinkButton: React.FC<CitationListLinkButtonProps> = ({ paper, actionArea, pageType, className }) => {
  if (!paper.citedCount) return null;

  return (
    <Link
      to={{
        pathname: `/papers/${paper.id}`,
        hash: 'cited',
      }}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea: actionArea || pageType,
          actionTag: 'citedList',
          actionLabel: String(paper.id),
        });
      }}
      className={className}
    >
      <span>{`${formatNumber(paper.citedCount)} Citations`}</span>
    </Link>
  );
};

export default CitationListLinkButton;
