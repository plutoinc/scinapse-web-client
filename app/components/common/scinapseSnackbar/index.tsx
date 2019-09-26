import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '../button';
import { getCurrentPageType } from '../../locationListener';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./scinapseSnackbar.scss');

interface ScinapseSnackbarProps {
  isOpen: boolean;
  handleOnClose: () => void;
  snackbarMessage: React.ReactNode;
  actionButton: React.ReactNode;
  openFrom: string;
}

const ScinapseSnackbar: React.FC<ScinapseSnackbarProps> = props => {
  useStyles(s);
  const { isOpen, openFrom, handleOnClose, snackbarMessage, actionButton } = props;

  return (
    <Snackbar
      classes={{ root: s.snackbarWrapper }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={isOpen}
      onClose={handleOnClose}
      autoHideDuration={5000}
      ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={snackbarMessage}
      action={[
        actionButton,
        <div className={s.closeBtn} key={`close`}>
          <Button
            elementType="button"
            variant="text"
            color="gray"
            size="small"
            onClick={() => {
              ActionTicketManager;
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: openFrom,
                actionTag: 'clickCloseButton',
                actionLabel: null,
              });

              handleOnClose();
            }}
          >
            <Icon icon="X_BUTTON" />
          </Button>
        </div>,
      ]}
    />
  );
};

export default ScinapseSnackbar;
