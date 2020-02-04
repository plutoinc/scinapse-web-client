import React, { FC, useMemo, useEffect } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import ProfileRegisterForm from '../profileRegisterForm';
import { useLocation, useHistory } from 'react-router-dom';
import QueryString from 'qs';
import { AppState } from '../../reducers';
import { useSelector } from 'react-redux';
const s = require('./profileRegiser.scss');

export type ProfileRegisterParams = {
  token: string;
}

const ProfileRegister: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const currentUser = useSelector((state: AppState) => state.currentUser);

  const queryParams: ProfileRegisterParams = useMemo(() => {
    return QueryString.parse(location.search.split('?')[1])
  }, [location.search])

  useEffect(() => {
    if (currentUser.profileId) {
      history.push(`/profiles/${currentUser.profileId}`);
    }
  }, [currentUser.profileId, history]);

  return (
    <>
      <div className={s.wrapper}>
        <ProfileRegisterForm
          queryParams={queryParams}
        />
      </div>
    </>
  )
}

export default withStyles<typeof ProfileRegister>(s)(ProfileRegister);
