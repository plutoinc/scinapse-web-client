import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { addPaperToRecommendation } from '../../../actions/recommendation';
const s = require('../actionBar.scss');

interface RequesrFullTextBtnProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  paperId: number;
  handleSetIsOpen: (value: React.SetStateAction<boolean>) => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  btnStyle?: React.CSSProperties;
  lastRequestedDate: string | null;
}

const RequestFullTextBtn: React.FC<RequesrFullTextBtnProps> = React.memo(props => {
  const { isLoggedIn, isLoading, paperId, actionArea, handleSetIsOpen, btnStyle, lastRequestedDate } = props;

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
      <button
        style={!!btnStyle ? btnStyle : {}}
        onClick={async () => {
          ActionTicketManager.trackTicket({
            pageType: 'paperShow',
            actionType: 'fire',
            actionArea,
            actionTag: 'clickRequestFullTextBtn',
            actionLabel: String(paperId),
          });

          if (!isLoggedIn) await addPaperToRecommendation(isLoggedIn, paperId);

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea,
            actionLabel: 'clickRequestFullTextBtn',
            userActionType: 'clickRequestFullTextBtn',
          });

          if (!isBlocked) {
            handleSetIsOpen(true);
          }
        }}
        className={s.fullTextBtn}
      >
        <Icon icon="SEND" className={s.sendIcon} />
        Request Full-text
      </button>
    </Tooltip>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
