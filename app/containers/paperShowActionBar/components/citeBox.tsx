import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import { CurrentUser } from '../../../model/currentUser';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { addBasedOnRecommendationActivity } from '../../../helpers/addBasedOnRecommendationActivity';
const s = require('./citeBox.scss');

interface CiteBoxProps {
  paper: Paper;
  actionArea: string;
  currentUser: CurrentUser;
  btnStyle?: React.CSSProperties;
}

const CiteBox: React.FunctionComponent<CiteBoxProps> = props => {
  const { paper, btnStyle, actionArea, currentUser } = props;

  if (!paper.doi) return null;

  return (
    <div
      style={!!btnStyle ? btnStyle : {}}
      className={s.citeButton}
      onClick={() => {
        GlobalDialogManager.openCitationDialog(paper.id);
        addBasedOnRecommendationActivity(currentUser.isLoggedIn, paper.id);
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
