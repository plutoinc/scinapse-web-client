import * as React from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { addPaperToRecommendPool } from '../../../components/recommendPool/actions';
const s = require('./citeBox.scss');

interface CiteBoxProps {
  paper: Paper;
  actionArea: string;
  btnStyle?: React.CSSProperties;
}

const CiteBox: React.FunctionComponent<CiteBoxProps> = props => {
  const { paper, btnStyle, actionArea } = props;
  const dispatch = useDispatch();

  if (!paper.doi) return null;

  return (
    <div
      style={!!btnStyle ? btnStyle : {}}
      className={s.citeButton}
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
      <div>
        <Icon icon={'CITATION_QUOTE'} className={s.citeIcon} />
        <span>Cite</span>
      </div>
    </div>
  );
};

export default withStyles<typeof CiteBox>(s)(CiteBox);
