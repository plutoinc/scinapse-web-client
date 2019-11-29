import * as React from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { addPaperToRecommendPool } from '../../../components/recommendPool/actions';
import { Paper } from '../../../model/paper';
import { Button } from '@pluto_network/pluto-design-elements';
const s = require('../actionBar.scss');

interface RequestFullTextBtnProps {
  isLoading: boolean;
  paper: Paper;
  onClick: () => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  lastRequestedDate: string | null;
}

const RequestFullTextBtn: React.FC<RequestFullTextBtnProps> = React.memo(props => {
  const dispatch = useDispatch();
  const { isLoading, paper, actionArea, onClick, lastRequestedDate } = props;

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  return (
    <Tooltip
      disableHoverListener={lastRequestedDate && lastRequestedDate.length > 0 ? false : true}
      disableFocusListener={true}
      disableTouchListener={true}
      title={`You sent the request on ${lastRequestedDate}.`}
      placement="top"
      classes={{ tooltip: s.arrowBottomTooltip }}
    >
      <Button
        elementType="button"
        variant="outlined"
        isLoading={isLoading}
        onClick={async () => {
          ActionTicketManager.trackTicket({
            pageType: 'paperShow',
            actionType: 'fire',
            actionArea,
            actionTag: 'clickRequestFullTextBtn',
            actionLabel: String(paper.id),
          });

          dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'clickRequestFullTextBtn' }));

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea,
            actionLabel: 'clickRequestFullTextBtn',
            userActionType: 'clickRequestFullTextBtn',
          });

          if (!isBlocked) {
            onClick();
          }
        }}
      >
        <Icon icon="SEND" />
        <span>Request Full-text</span>
      </Button>
    </Tooltip>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
