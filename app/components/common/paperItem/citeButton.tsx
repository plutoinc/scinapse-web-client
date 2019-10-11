import React from 'react';
import { useDispatch } from 'react-redux';
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
}

const CiteButton: React.FC<CiteButtonProps> = ({ paper, pageType, actionArea }) => {
  const dispatch = useDispatch();

  if (!paper.doi) return null;

  return (
    <button
      className={styles.citeButton}
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
      <Icon className={styles.citationIcon} icon="CITATION_QUOTE" />

      <span>Cite</span>
    </button>
  );
};

export default withStyles<typeof CiteButton>(styles)(CiteButton);
