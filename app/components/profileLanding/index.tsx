import React, { FC, useEffect } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import { Button } from '@pluto_network/pluto-design-elements';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { getCurrentPageType } from '../locationListener';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';
import AffiliationAPI from '../../api/affiliation';
const s = require('./profileLanding.scss');

type ProfileLandingQuery = {
  aid: string;
}

const ProfileLanding: FC = () => {
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);
  const location = useLocation();

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

  useEffect(() => {
    const queryString = location.search.split('?')[1];
    const { aid } = QueryString.parse(queryString) as ProfileLandingQuery;
    AffiliationAPI.getAffiliation(aid).then(profileAff => {
      console.log(profileAff.domains);
    });
  }, [location.search]);

  return (
    <>
      <div className={s.wrapper}>
        <h1>Create a profile</h1>
        <p>Some appealing description to hookup the user to make them want to create a profile.</p>
        <div className={s.keyButtonContainer}>
          {currentUser.isLoggedIn ? (
            <Button
              elementType="link"
              to={{
                pathname: '/profile/verify-email',
                search: location.search,
              }}
              color="blue"
            >
              <span>
                Continue as <b>{currentUser.firstName}</b>
              </span>
            </Button>
          ) : (
            <>
              <div className={s.signinLabel}>
                Not a Scinapse user?
              </div>
              <Button
                elementType="link"
                to={{
                  pathname: '/profile/verify-email',
                  search: location.search,
                }}
                color="blue"
              >
                <span>Create an account & make profile</span>
              </Button>
              <div className={s.signinLabel}>
                Already a user?
                {/* <span className={s.signinTextLinkButton} onClick={openSigninModal}>sign in</span> */}
              </div>
              <Button elementType="button" color="gray" onClick={openSigninModal}>
                <span>Sign in</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default withStyles<typeof ProfileLanding>(s)(ProfileLanding);
