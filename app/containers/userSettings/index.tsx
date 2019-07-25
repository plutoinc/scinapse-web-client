import React from 'react';
import ProfileForm from '../profileForm';
import { withStyles } from '../../helpers/withStylesHelper';

const s = require('./userSettings.scss');

const UserSettings: React.FC = () => {
  return (
    <div className={s.wrapper}>
      <h1>Settings</h1>
      <ProfileForm />
    </div>
  );
};

export default withStyles<typeof UserSettings>(s)(UserSettings);
