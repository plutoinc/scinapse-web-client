import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from '@pluto_network/pluto-design-elements';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { AppState } from '../../reducers';
import { UserDevice } from '../layouts/reducer';
import { getCurrentPageType } from '../locationListener';
import { openCreateKeywordAlertDialog } from '../../reducers/createKeywordAlertDialog';
import Icon from '../../icons';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../helpers/checkAuthDialog';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./alertCreateButton.scss');

interface AlertCreateButtonProps {
  searchInput?: string;
}

const AlertCreateButton: React.FC<AlertCreateButtonProps> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const { isMobile } = useSelector((state: AppState) => ({
    isMobile: state.layout.userDevice === UserDevice.MOBILE,
  }));

  const { searchInput } = props;

  return (
    <Tooltip
      disableFocusListener={true}
      disableTouchListener={true}
      title="📩 We’ll send updated papers for this results via registered email."
      placement={isMobile ? 'bottom' : 'bottom-end'}
      classes={{ tooltip: s.arrowTopTooltip, popper: s.arrowTopTooltipWrapper }}
    >
      <Button
        elementType="button"
        aria-label="Create keyword alert"
        size="small"
        variant="outlined"
        color="blue"
        fullWidth={isMobile}
        disabled={false}
        onClick={async () => {
          ActionTicketManager.trackTicket({
            pageType: getCurrentPageType(),
            actionType: 'fire',
            actionArea: 'createAlertBtn',
            actionTag: 'clickCreateAlertBtn',
            actionLabel: 'clickCreateAlertBtn',
          });

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.UNVERIFIED,
            actionArea: 'createAlertBtn',
            actionLabel: 'clickCreateAlertBtn',
            userActionType: 'clickCreateAlertBtn',
          });

          if (isBlocked) return;

          dispatch(
            openCreateKeywordAlertDialog({ from: getCurrentPageType(), keyword: !searchInput ? '' : searchInput })
          );
        }}
        style={{
          alignSelf: 'baseline',
          marginTop: '8px',
        }}
      >
        <Icon icon="ALERT" className={s.alertIcon} />
        <span>Create alert</span>
      </Button>
    </Tooltip>
  );
};

export default AlertCreateButton;
