import React, { FC, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import QueryString from 'qs';
import ProfileRegisterForm from '../profileRegisterForm';
import { AppState } from '../../reducers';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileRegiser.scss');

export type ProfileRegisterParams = {
  token: string;
};

const ProfileRegister: FC = () => {
  useStyles(s);
  const location = useLocation();
  const history = useHistory();
  const currentUser = useSelector((state: AppState) => state.currentUser);

  const queryParams: ProfileRegisterParams = useMemo(() => {
    return QueryString.parse(location.search.split('?')[1]);
  }, [location.search]);

  useEffect(() => {
    if (currentUser.profileSlug) {
      history.push(`/profiles/${currentUser.profileSlug}`);
    }
  }, [currentUser.profileSlug, history]);

  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <ProfileRegisterForm queryParams={queryParams} />
      </div>
    </div>
  );
};

export default ProfileRegister;
