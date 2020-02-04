import React, { FC, useEffect, useState } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import { Button } from '@pluto_network/pluto-design-elements';
import { useLocation, useHistory } from 'react-router-dom';
import QueryString from 'qs';
import AffiliationAPI from '../../api/affiliation';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import globalDialogManager from '../../helpers/globalDialogManager';
import { getCurrentPageType } from '../locationListener';
const s = require('./profileLanding.scss');

type ProfileLandingQuery = {
  aid: string;
}

const ProfileLanding: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isValidAffiliationId, setIsValidAffiliationId] = useState<boolean>(false);
  const currentUser = useSelector((state: AppState) => state.currentUser);

  useEffect(() => {
    const queryString = location.search.split('?')[1];
    const { aid } = QueryString.parse(queryString) as ProfileLandingQuery;
    if (aid) {
      AffiliationAPI.getAffiliation(aid).then(profileAff => {
        setIsValidAffiliationId(profileAff.domains.length > 0);
        setIsLoaded(true);
      }).catch(() => {
        setIsValidAffiliationId(false);
        setIsLoaded(true);
      });
    } else {
      setIsValidAffiliationId(false);
      setIsLoaded(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (currentUser.profileId) {
      history.push(`/profiles/${currentUser.profileId}`);
    }
  }, [currentUser.profileId]);

  useEffect(() => {
    if (isValidAffiliationId || !isLoaded) return;
    history.push('/profiles/landing/enquiry');
  }, [isValidAffiliationId, isLoaded]);

  const handleContinueButtonClick = () => {
    if (isLoaded && isValidAffiliationId) {
      history.push(`/profiles/verify-email${location.search}`);
    }
  }

  const handleSigninButtonClick = () => {
    globalDialogManager.openSignInDialog({
      authContext: {
        pageType: getCurrentPageType(),
        actionArea: 'createProfile',
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
        <p>If you are already a Scinapse user, please sign in.</p>
        <div className={s.keyButtonContainer}>
          {
            currentUser.isLoggedIn || (
              <Button
                elementType="button"
                color="gray"
                isLoading={!isLoaded}
                onClick={handleSigninButtonClick}
              >
                <span>
                  Sign in
                </span>
              </Button>
            )
          }
          {
            isValidAffiliationId
            ? (
              <Button
                elementType="button"
                color="blue"
                isLoading={!isLoaded}
                onClick={handleContinueButtonClick}
              >
                <span>
                  {
                    currentUser.isLoggedIn ? 'Connect profile' : 'Create an account & make profile'
                  }
                </span>
              </Button>
            ) : (
              <Button
                elementType="button"
                color="blue"
                isLoading={!isLoaded}
                onClick={handleContinueButtonClick}
              >
                <span>
                  Sorry
                </span>
              </Button>
            )
          }
        </div>
      </div>
    </>
  );
};

export default withStyles<typeof ProfileLanding>(s)(ProfileLanding);
