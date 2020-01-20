import React, { FC } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import ProfileVerifyEmailForm from '../profileVerifyEmailForm';
const s = require('./profileVerifyEmail.scss');

const ProfileVerifyEmail: FC = () => {
  return (
    <>
      <div className={s.wrapper}>
        <div className={s.cardContainer}>
          <h2>
            Verify by email
          </h2>
          <ProfileVerifyEmailForm />
        </div>
      </div>
    </>
  )
}

export default withStyles<typeof ProfileVerifyEmail>(s)(ProfileVerifyEmail);
