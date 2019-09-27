import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScinapseSnackbar from '../../common/scinapseSnackbar';
import Button from '../../common/button';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
import { AppState } from '../../../reducers';
import { ScinapseSnackbarState, closeSnackbar } from '../../../reducers/scinapseSnackbar';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./createKeywordSnackBar.scss');

const CreateKeywordSnackBar: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const createKeywordSnackbarState = useSelector<AppState, ScinapseSnackbarState>(state => state.scinapseSnackbarState);

  const { isOpen } = createKeywordSnackbarState;

  return (
    <ScinapseSnackbar
      open={isOpen}
      onClose={() => dispatch(closeSnackbar())}
      openFrom="createKeywordSnackbar"
      message={
        <span id="message-id" className={s.snackbarContext}>
          Alert created
        </span>
      }
      action={
        <div className={s.seeAllBtn} key={`seeAll`}>
          <Button
            elementType="link"
            variant="text"
            color="blue"
            size="large"
            to={`/keyword-settings`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'createKeywordSnackbar',
                actionTag: 'clickSeeAllBtn',
                actionLabel: null,
              });

              dispatch(closeSnackbar());
            }}
          >
            See alert list
          </Button>
        </div>
      }
    />
  );
};

export default CreateKeywordSnackBar;
