import React, { FC, useEffect, useState } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import { Button } from '@pluto_network/pluto-design-elements';
import { useLocation, useHistory } from 'react-router-dom';
import QueryString from 'qs';
import AffiliationAPI from '../../api/affiliation';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
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

  return (
    <>
      <div className={s.wrapper}>
        <h1>Create a profile</h1>
        <p>Some appealing description to hookup the user to make them want to create a profile.</p>
        <div className={s.keyButtonContainer}>
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
                  Continue
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
