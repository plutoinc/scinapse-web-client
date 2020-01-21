import React, { FC } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import { Button } from '@pluto_network/pluto-design-elements';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { getCurrentPageType } from '../locationListener';
const s = require('./profileLanding.scss');

const ProfileLanding: FC = () => {
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);

  const openSigninModal = () => {
    GlobalDialogManager.openSignInDialog({
      authContext: {
        pageType: getCurrentPageType(),
        actionArea: 'topBar',
        actionLabel: null,
      },
      isBlocked: false,
    });
  }

  return (
    <>
      <div className={s.wrapper}>
        <h1>Create a profile</h1>
        <p>Some appealing description to hookup the user to make them want to create a profile.</p>
        <div className={s.keyButtonContainer}>
          {currentUser.isLoggedIn ? (
            <Button elementType="link" to="/profile/verify-email" color="blue">
              <span>
                Continue as <b>{currentUser.firstName}</b>
              </span>
            </Button>
          ) : (
            <>
              <Button elementType="link" to="/profile/verify-email" color="blue">
                <span>Continue</span>
              </Button>
              <div className={s.signinLabel}>
                If you have an account,
                <span className={s.signinTextLinkButton} onClick={openSigninModal}>sign in</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default withStyles<typeof ProfileLanding>(s)(ProfileLanding);
