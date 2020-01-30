import React, { FC, useMemo } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import ProfileRegisterForm from '../profileRegisterForm';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';
const s = require('./profileRegiser.scss');

export type ProfileRegisterParams = {
  token: string;
}

const ProfileRegister: FC = () => {
  const location = useLocation();

  const queryParams: ProfileRegisterParams = useMemo(() => {
    return QueryString.parse(location.search.split('?')[1])
  }, [location.search])

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
