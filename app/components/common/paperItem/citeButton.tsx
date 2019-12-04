import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
const styles = require('./citeButton.scss');

interface CiteButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
  isMobile?: boolean;
}

const CiteButton: React.FC<CiteButtonProps> = ({ paper, pageType, actionArea, className, isMobile }) => {
  const dispatch = useDispatch();

  if (!paper.doi) return null;

  return (
    <div className={className}>
      <Button
        elementType="button"
        aria-label="Cite button"
        size="small"
        variant={isMobile ? 'contained' : 'outlined'}
        color={isMobile ? 'black' : 'blue'}
        onClick={async () => {
          dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'citePaper' }));
          GlobalDialogManager.openCitationDialog(paper.id);
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'citePaper',
            actionLabel: String(paper.id),
          });
        }}
      >
        <Icon icon="CITATION" />
        <span>Cite</span>
      </Button>
    </div>
  );
};

export default withStyles<typeof CiteButton>(styles)(CiteButton);
