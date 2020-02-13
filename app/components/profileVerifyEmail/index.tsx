import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { useLocation, useHistory } from 'react-router-dom';
import ProfileVerifyEmailForm from '../profileVerifyEmailForm';
import { AppState } from '../../reducers';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
const s = require('./profileVerifyEmail.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

export type ProfileEmailQueryParams = {
  aid?: string;
};

const ProfileVerifyEmail: FC = () => {
  useStyles(s);
  const location = useLocation();
  const history = useHistory();
  const currentUser = useSelector((state: AppState) => state.currentUser, isEqual);

  useEffect(
    () => {
      if (currentUser.profileSlug) history.push(`/profiles/${currentUser.profileSlug}`);
    },
    [currentUser.profileSlug, history]
  );

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.cardContainer}>
          <h2>Verify by email</h2>
          <ProfileVerifyEmailForm queryParams={getQueryParamsObject(location.search)} />
        </div>
      </div>
    </>
  );
};

export default ProfileVerifyEmail;
