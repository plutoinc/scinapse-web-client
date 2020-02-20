import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import { Button } from '@pluto_network/pluto-design-elements';
import AffiliationAPI from '../../api/affiliation';
import { AppState } from '../../reducers';
import ImprovedFooter from '../layouts/improvedFooter';
import GlobalDialogManager from '../../helpers/globalDialogManager';
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

  const getAffiliationFromQueryString = useCallback(
    async (aid: string) => {
      try {
        const profileAffiliation = await AffiliationAPI.getAffiliation(aid);
        if (profileAffiliation.domains.length === 0) {
          history.push('/profiles/landing/enquiry');
        }

        setIsLoaded(true);
      } catch (err) {
        console.error(err);
        history.push('/profiles/landing/enquiry');
      }
    },
    [history]
  );

  useEffect(() => {
    if (currentUser.profileSlug) {
      history.push(`/profiles/${currentUser.profileSlug}`);
    }
  }, [currentUser.profileSlug, history]);

  useEffect(() => {
    const queryString = getQueryParamsObject(location.search);
    const { aid } = queryString as ProfileLandingQuery;

    if (!aid) {
      history.push('/profiles/landing/enquiry');
    }

    getAffiliationFromQueryString(aid);
  }, [location.search, history, getAffiliationFromQueryString]);

  return (
    <>
      <div className={s.pageContainer}>
        <div className={s.wrapper}>
          <div>
            <h1 className={s.title}>
              <div>Create</div>
              <div>your professional</div>
              <div>researcher profile</div>
            </h1>
            <div className={s.subtitle}>Create your publication profile and join the community for free</div>
            <div>If you already use Scinapse, please log in first to create your profile</div>
            <div>Or sign up & create profile now</div>
            <div className={s.btnContainer}>
              {!currentUser.isLoggedIn && (
                <Button
                  size="large"
                  style={{ marginBottom: '16px' }}
                  elementType="button"
                  color="blue"
                  variant="outlined"
                  isLoading={!isLoaded}
                  onClick={() =>
                    GlobalDialogManager.openSignInDialog({
                      authContext: {
                        pageType: getCurrentPageType(),
                        actionArea: 'createProfile',
                        actionLabel: null,
                      },
                      isBlocked: false,
                    })
                  }
                  fullWidth
                >
                  <span>Sign in</span>
                </Button>
              )}
              <Button
                size="large"
                elementType="button"
                color="blue"
                isLoading={!isLoaded}
                onClick={() => {
                  if (isLoaded) {
                    history.push(`/profiles/verify-email${location.search}`);
                  }
                }}
                fullWidth
              >
                <span>{currentUser.isLoggedIn ? 'Create profile' : 'Create an account & make profile'}</span>
              </Button>
            </div>
          </div>
          <div className={s.rightBox}>
            <img
              className={s.bannerImage}
              src="//assets.scinapse.io/images/profile_hawking_screenshot.png"
              alt="profile show page example image"
            />
          </div>
        </div>
        <div className={s.wrapper}>
          <div className={s.leftBox}>
            <img
              className={s.researchersImage}
              src="//assets.scinapse.io/images/researchers.png"
              alt="researchers image"
            />
          </div>
          <div>
            <h1 className={s.paragraphTitle}>Welcome to the professional research community</h1>
            <div className={s.listWrapper}>
              <div className={s.listTitle}>
                Share your list of publications with colleagues and professional communities
              </div>
              <div className={s.listDescription}>
                Share your professional academic profile on your website or on your organization’s site
              </div>
            </div>
            <div className={s.listWrapper}>
              <div className={s.listTitle}>Display and manage your publication list</div>
              <div className={s.listDescription}>
                Share your publication list, educational and experience background, awards (no personal information
                shared) on your professional profile
              </div>
            </div>
            <div className={s.listWrapper}>
              <div className={s.listTitle}>See your profile analysis</div>
              <div className={s.listDescription}>
                <div>Know how many people saw your profile</div>
                <div>Know which new papers cited your paper</div>
                <div>and more features coming!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImprovedFooter containerStyle={{ width: '100%', backgroundColor: 'white' }} />
    </>
  );
};

export default ProfileLanding;
