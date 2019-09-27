import React from 'react';
import ScinapseSnackbar from '../../common/scinapseSnackbar';
import Button from '../../common/button';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../reducers';
import { ScinapseSnackbarState, closeSnackbar } from '../../../reducers/scinapseSnackbar';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./createKeywordSnackBar.scss');

const CreateKeywordSnackBar: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const createKeywordSnackbarState = useSelector<AppState, ScinapseSnackbarState>(state => state.scinapseSnackbarState);

  const { isOpen } = createKeywordSnackbarState;
  console.log(isOpen);

  return (
    <ScinapseSnackbar
      isOpen={isOpen}
      handleOnClose={() => dispatch(closeSnackbar())}
      openFrom="createKeywordSnackbar"
      snackbarMessage={
        <span id="message-id" className={s.snackbarContext}>
          Alert created
        </span>
      }
      actionButton={
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
            See all
          </Button>
        </div>
      }
    />
  );
};

export default CreateKeywordSnackBar;
