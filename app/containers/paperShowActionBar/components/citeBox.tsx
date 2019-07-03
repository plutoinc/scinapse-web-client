import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import { CurrentUser } from '../../../model/currentUser';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { addBasedOnRecommendationActivity } from '../../../helpers/basedOnRecommendationActivityManager';
const s = require('./citeBox.scss');

interface CiteBoxProps {
  paper: Paper;
  actionArea: string;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
  btnStyle?: React.CSSProperties;
}

const CiteBox: React.FunctionComponent<CiteBoxProps> = props => {
  const { paper, btnStyle, actionArea, dispatch, currentUser } = props;

  if (!paper.doi) return null;

  return (
    <div
      style={!!btnStyle ? btnStyle : {}}
      className={s.citeButton}
      onClick={async () => {
        await dispatch(addBasedOnRecommendationActivity(currentUser.isLoggedIn, paper.id));
        GlobalDialogManager.openCitationDialog(paper.id);
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

export default connect()(withStyles<typeof CiteBox>(s)(CiteBox));
