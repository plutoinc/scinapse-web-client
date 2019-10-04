import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { addPaperToRecommendPoolAndOpenDialog } from '../../recommendPool/recommendPoolActions';
import formatNumber from '../../../helpers/formatNumber';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
const s = require('./citationListLinkButton.scss');

interface CitationListLinkButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

const CitationListLinkButton: React.FC<CitationListLinkButtonProps> = ({ paper, actionArea, pageType }) => {
  const dispatch = useDispatch();

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
        dispatch(
          addPaperToRecommendPoolAndOpenDialog({
            pageType,
            actionArea: 'citationButton',
            recAction: { paperId: paper.id, action: 'citePaper' },
          })
        );
      }}
      className={s.citedButton}
    >
      <span>{`${formatNumber(paper.citedCount)} Citations`}</span>
    </Link>
  );
};

export default withStyles<typeof CitationListLinkButton>(s)(CitationListLinkButton);
