import React, { FC } from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import ProfileRegisterForm from '../profileRegisterForm';
const s = require('./profileRegiser.scss');

const ProfileRegister: FC = () => {
  return (
    <>
      <div className={s.wrapper}>
        <ProfileRegisterForm/>
      </div>
    </>
  )
}

export default withStyles<typeof ProfileRegister>(s)(ProfileRegister);
