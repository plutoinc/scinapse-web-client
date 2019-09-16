import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Location } from 'history';
import Snackbar from '@material-ui/core/Snackbar';
import { AppState } from '../../../reducers';
import { closeCollectionSnackBar } from '../../../reducers/collectionSnackBar';
import { closeDialog } from '../../dialog/actions';
import Icon from '../../../icons';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./collectionSnackBar.scss');
type Props = ReturnType<typeof mapStateToProps> & {
  location: Location;
};

const CollectionSnackBar: React.FC<Props> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const { collectionSnackBarState, location } = props;
  const { collectionId, collectionName, isOpen } = collectionSnackBarState;
  const isLongName = collectionName.length >= 30;

  useEffect(
    () => {
      dispatch(closeCollectionSnackBar());
    },
    [location]
  );

  useEffect(
    () => {
      if (isOpen) {
        ActionTicketManager.trackTicket({
          pageType: getCurrentPageType(),
          actionType: 'view',
          actionArea: 'collectionSnackbar',
          actionTag: 'viewCollectionSnackBar',
          actionLabel: String(collectionId),
        });
      }
    },
    [isOpen, collectionId]
  );

  return (
    <Snackbar
      classes={{ root: s.snackbarWrapper }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={isOpen}
      onClose={() => dispatch(closeCollectionSnackBar())}
      autoHideDuration={5000}
      ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={
        <span id="message-id" className={s.snackbarContext}>
          {`Saved to `}
          {isLongName && <br />}
          {`${collectionName}.`}
        </span>
      }
      action={[
        <Link
          className={s.goToCollectionBtn}
          key={`goToCollection`}
          to={`/collections/${collectionId}`}
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'collectionSnackbar',
              actionTag: 'clickViewCollection',
              actionLabel: String(collectionId),
            });

            dispatch(closeCollectionSnackBar());
            dispatch(closeDialog());
          }}
        >
          View Collection
        </Link>,
        <button
          className={s.closeBtn}
          key={`close`}
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'collectionSnackbar',
              actionTag: 'clickCloseButton',
              actionLabel: null,
            });

            dispatch(closeCollectionSnackBar());
          }}
        >
          <Icon icon="X_BUTTON" />
        </button>,
      ]}
    />
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    collectionSnackBarState: state.collectionSnackBarState,
  };
};

export default connect(mapStateToProps)(CollectionSnackBar);
