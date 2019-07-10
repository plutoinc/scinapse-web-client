import * as React from 'react';
import * as format from 'date-fns/format';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { CurrentUser } from '../../../model/currentUser';
import Tooltip from '@material-ui/core/Tooltip';
import PaperAPI from '../../../api/paper';
const s = require('../actionBar.scss');

interface RequesrFullTextBtnProps {
  isLoading: boolean;
  paperId: number;
  currentUser: CurrentUser;
  handleSetIsOpen: (value: React.SetStateAction<boolean>) => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  btnStyle?: React.CSSProperties;
}

const RequestFullTextBtn: React.FC<RequesrFullTextBtnProps> = React.memo(props => {
  const { isLoading, currentUser, paperId, actionArea, handleSetIsOpen, btnStyle } = props;
  const [requestedAt, setRequestedAt] = React.useState('');

  React.useEffect(
    () => {
      if (paperId && currentUser.isLoggedIn) {
        PaperAPI.getLastRequestDate(paperId).then(res => {
          setRequestedAt(format(res.requestedAt, 'MMMM D, YY'));
        });
      }
    },
    [currentUser.isLoggedIn, paperId]
  );

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  return (
    <Tooltip
      disableFocusListener={true}
      disableTouchListener={true}
      title={`You sent the request on ${requestedAt}.`}
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
