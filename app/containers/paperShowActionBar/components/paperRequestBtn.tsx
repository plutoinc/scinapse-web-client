import * as React from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from '@pluto_network/pluto-design-elements';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { addPaperToRecommendPool } from '../../../components/recommendPool/actions';
import { Paper } from '../../../model/paper';
const s = require('../actionBar.scss');

interface RequestPaperBtnProps {
  isLoading: boolean;
  paper: Paper;
  onClick: () => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  lastRequestedDate: string | null;
}

const RequestPaperBtn: React.FC<RequestPaperBtnProps> = React.memo(props => {
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
        aria-label="Open dialog to request full text button"
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
        <span>Request Paper</span>
      </Button>
    </Tooltip>
  );
});

export default withStyles<typeof RequestPaperBtn>(s)(RequestPaperBtn);
