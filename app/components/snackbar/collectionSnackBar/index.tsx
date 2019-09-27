import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../../reducers';
import { closeDialog } from '../../dialog/actions';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
import { UserDevice } from '../../layouts/reducer';
import Button from '../../common/button';
import ScinapseSnackbar from '../../common/scinapseSnackbar';
import { ScinapseSnackbarState, closeSnackbar } from '../../../reducers/scinapseSnackbar';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./collectionSnackBar.scss');

const CollectionSnackBar: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();

  const collectionSnackBarState = useSelector<AppState, ScinapseSnackbarState>(state => state.scinapseSnackbarState);
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);

  const { id, context, isOpen } = collectionSnackBarState;
  const isLongName = !!context && context.length >= 30 && userDevice === UserDevice.MOBILE;

  useEffect(
    () => {
      if (isOpen) {
        ActionTicketManager.trackTicket({
          pageType: getCurrentPageType(),
          actionType: 'view',
          actionArea: 'collectionSnackbar',
          actionTag: 'viewCollectionSnackBar',
          actionLabel: String(id),
        });
      }
    },
    [isOpen, id]
  );

  return (
    <ScinapseSnackbar
      isOpen={isOpen}
      handleOnClose={() => dispatch(closeSnackbar())}
      openFrom="collectionSnackbar"
      snackbarMessage={
        <span id="message-id" className={s.snackbarContext}>
          {`Saved to `}
          {isLongName && <br />}
          <Link
            className={s.collectionName}
            to={`/collections/${id}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'collectionSnackbar',
                actionTag: 'clickCollectionTitle',
                actionLabel: String(id),
              });

              dispatch(closeSnackbar());
              dispatch(closeDialog());
            }}
          >{`${context}.`}</Link>
        </span>
      }
      actionButton={
        <div className={s.viewCollectionBtn} key={`viewCollection`}>
          <Button
            elementType="link"
            variant="text"
            color="blue"
            size="large"
            to={`/collections/${id}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'collectionSnackbar',
                actionTag: 'clickViewCollection',
                actionLabel: String(id),
              });

              dispatch(closeSnackbar());
              dispatch(closeDialog());
            }}
          >
            View Collection
          </Button>
        </div>
      }
    />
  );
};

export default CollectionSnackBar;
