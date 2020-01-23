import React, { FC, useMemo } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import ProfileVerifyEmailForm from '../profileVerifyEmailForm';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';
const s = require('./profileVerifyEmail.scss');

type QueryParams = {
  aid?: string;
}

const ProfileVerifyEmail: FC = () => {
  const location = useLocation();

  const queryParams: QueryParams = useMemo(() => {
    return QueryString.parse(location.search.split('?')[1])
  }, [location.search])

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.cardContainer}>
          <h2>
            Verify by email
          </h2>
          <ProfileVerifyEmailForm
            aid={queryParams.aid}
          />
        </div>
      </div>
    </>
  )
}

export default withStyles<typeof ProfileVerifyEmail>(s)(ProfileVerifyEmail);
