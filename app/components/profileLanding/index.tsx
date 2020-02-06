import React, { FC, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { Button } from '@pluto_network/pluto-design-elements';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AffiliationAPI from '../../api/affiliation';
import { AppState } from '../../reducers';
import globalDialogManager from '../../helpers/globalDialogManager';
import { getCurrentPageType } from '../locationListener';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileLanding.scss');

type ProfileLandingQuery = {
  aid: string;
};

const ProfileLanding: FC = () => {
  useStyles(s);
  const location = useLocation();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);

  useEffect(
    () => {
      if (currentUser.profileId) history.push(`/profiles/${currentUser.profileId}`);
    },
    [currentUser.profileId, history]
  );

  useEffect(
    () => {
      const queryString = getQueryParamsObject(location.search);
      const { aid } = queryString as ProfileLandingQuery;

      if (!aid) history.push('/profiles/landing/enquiry');

      AffiliationAPI.getAffiliation(aid)
        .then(profileAff => {
          if (profileAff.domains.length === 0) history.push('/profiles/landing/enquiry');
          setIsLoaded(true);
        })
        .catch(() => {
          history.push('/profiles/landing/enquiry');
        });
    },
    [location.search, history]
  );

  const handleClickContinueBtn = () => {
    if (isLoaded) {
      history.push(`/profiles/verify-email${location.search}`);
    }
  };

  const handleSigninButtonClick = () => {
    globalDialogManager.openSignInDialog({
      authContext: {
        pageType: getCurrentPageType(),
        actionArea: 'createProfile',
        actionLabel: null,
      },
      isBlocked: false,
    });
  };

  return (
    <div className={s.wrapper}>
      <div>
        <h1>Welcome to your professional research community</h1>
        <p>Make your own profile, and join the research network</p>
        <p>If you are already a Scinapse user, please sign in.</p>
        <div className={s.btnContainer}>
          {!currentUser.isLoggedIn && (
            <Button
              style={{ marginBottom: '16px' }}
              elementType="button"
              color="gray"
              isLoading={!isLoaded}
              onClick={handleSigninButtonClick}
              fullWidth
            >
              <span>Sign in</span>
            </Button>
          )}
          <Button elementType="button" color="blue" isLoading={!isLoaded} onClick={handleClickContinueBtn} fullWidth>
            <span>{currentUser.isLoggedIn ? 'Create profile' : 'Create an account & make profile'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileLanding;
