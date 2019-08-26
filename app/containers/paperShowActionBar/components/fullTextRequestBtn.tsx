import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from '../../../components/paperShow/components/searchingPDFBtn';
import { useDispatch } from 'react-redux';
import { addPaperToTempPool } from '../../../components/recommendPool/recommendPoolReducer';
const s = require('../actionBar.scss');

interface RequestFullTextBtnProps {
  isLoading: boolean;
  paperId: number;
  onClick: () => void;
  actionArea: Scinapse.ActionTicket.ActionArea;
  btnStyle?: React.CSSProperties;
  lastRequestedDate: string | null;
}

const RequestFullTextBtn: React.FC<RequestFullTextBtnProps> = React.memo(props => {
  const { isLoading, paperId, actionArea, onClick, btnStyle, lastRequestedDate } = props;
  const dispatch = useDispatch();

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

          dispatch(
            addPaperToTempPool({
              pageType: 'paperShow',
              actionArea: ' ',
              paperId,
            })
          );

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
        className={s.fullTextBtn}
      >
        <Icon icon="SEND" className={s.sendIcon} />
        Request Full-text
      </button>
    </Tooltip>
  );
});

export default withStyles<typeof RequestFullTextBtn>(s)(RequestFullTextBtn);
