import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Paper } from '../../../model/paper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { addPaperToRecommendPool } from '../../../components/recommendPool/actions';
import { Button } from '@pluto_network/pluto-design-elements';

interface CiteBoxProps {
  paper: Paper;
  actionArea: string;
}

const CiteBox: React.FunctionComponent<CiteBoxProps> = props => {
  const { paper, actionArea } = props;
  const dispatch = useDispatch();

  if (!paper.doi) return null;

  return (
    <Button
      elementType="button"
      aria-label="Cite button"
      color="gray"
      onClick={async () => {
        GlobalDialogManager.openCitationDialog(paper.id);
        dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'citePaper' }));
        ActionTicketManager.trackTicket({
          pageType: 'paperShow',
          actionType: 'fire',
          actionArea,
          actionTag: 'citePaper',
          actionLabel: String(paper.id),
        });
      }}
    >
      <Icon icon="CITATION" />
      <span>Cite</span>
    </Button>
  );
};

export default CiteBox;
