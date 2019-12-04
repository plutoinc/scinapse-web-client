import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@pluto_network/pluto-design-elements';
import { AppState } from '../../../reducers';
import { closeDialog } from '../../dialog/actions';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
import { UserDevice } from '../../layouts/reducer';
import ScinapseSnackbar from '../../common/scinapseSnackbar';
import { ScinapseSnackbarState, closeSnackbar } from '../../../reducers/scinapseSnackbar';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./collectionSnackBar.scss');

const CollectionSnackBar: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();

  const collectionSnackBarState = useSelector<AppState, ScinapseSnackbarState>(state => state.scinapseSnackbarState);
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);

  const { collectionId, context, isOpen } = collectionSnackBarState;
  const isLongName = !!context && context.length >= 30 && userDevice === UserDevice.MOBILE;

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
    <ScinapseSnackbar
      open={isOpen}
      onClose={() => dispatch(closeSnackbar())}
      openFrom="collectionSnackbar"
      message={
        <span id="message-id" className={s.snackbarContext}>
          {`Saved to `}
          {isLongName && <br />}
          <Link
            className={s.collectionName}
            to={`/collections/${collectionId}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'collectionSnackbar',
                actionTag: 'clickCollectionTitle',
                actionLabel: String(collectionId),
              });

              dispatch(closeSnackbar());
              dispatch(closeDialog());
            }}
          >{`${context}.`}</Link>
        </span>
      }
      action={
        <div className={s.viewCollectionBtn} key={`viewCollection`}>
          <Button
            elementType="link"
            variant="text"
            color="blue"
            size="large"
            to={`/collections/${collectionId}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'collectionSnackbar',
                actionTag: 'clickViewCollection',
                actionLabel: String(collectionId),
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
