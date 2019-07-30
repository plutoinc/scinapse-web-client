import React from 'react';
import ProfileForm from '../profileForm';
import AuthEditForm from '../authEditForm';
import { withStyles } from '../../helpers/withStylesHelper';
import ImprovedFooter from '../../components/layouts/improvedFooter';

const s = require('./userSettings.scss');

const UserSettings: React.FC = () => {
  return (
    <>
      <div className={s.wrapper}>
        <h1 className={s.title}>Settings</h1>
        <ProfileForm />
        <div className={s.authFormWrapper}>
          <AuthEditForm />
        </div>
      </div>
      <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />
    </>
  );
};

export default withStyles<typeof UserSettings>(s)(UserSettings);
