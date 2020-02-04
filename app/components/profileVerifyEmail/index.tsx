import React, { FC, useMemo, useEffect } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import ProfileVerifyEmailForm from '../profileVerifyEmailForm';
import { useLocation, useHistory } from 'react-router-dom';
import QueryString from 'qs';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
const s = require('./profileVerifyEmail.scss');

export type ProfileEmailQueryParams = {
  aid?: string;
};

const ProfileVerifyEmail: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const currentUser = useSelector((state: AppState) => state.currentUser);

  useEffect(
    () => {
      if (currentUser.profileId) {
        history.push(`/profiles/${currentUser.profileId}`);
      }
    },
    [currentUser.profileId]
  );

  const queryParams: ProfileEmailQueryParams = useMemo(
    () => {
      return QueryString.parse(location.search.split('?')[1]);
    },
    [location.search]
  );

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.cardContainer}>
          <h2>Verify by email</h2>
          <ProfileVerifyEmailForm queryParams={queryParams} />
        </div>
      </div>
    </>
  );
};

export default withStyles<typeof ProfileVerifyEmail>(s)(ProfileVerifyEmail);
