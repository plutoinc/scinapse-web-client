import React from 'react';
import ProfileForm from '../profileForm';
import AuthEditForm from '../authEditForm';
import { withStyles } from '../../helpers/withStylesHelper';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import EmailSettings from '../../components/emailSettings/emailSettings';

const s = require('./userSettings.scss');

const UserSettings: React.FC = () => {
  return (
    <>
      <div className={s.wrapper}>
        <h1 className={s.title}>Settings</h1>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e7eaef',
          }}
        >
          <div
            style={{
              fontSize: `18px`,
              fontWeight: 500,
              color: '#3e7fff',
              borderBottom: `2px solid #327fff`,
              padding: '4px 8px',
            }}
          >
            User
          </div>
          <div
            style={{
              fontSize: `18px`,
              fontWeight: 500,
              color: '#9aa3b5',
              marginLeft: '16px',
              padding: '4px 8px',
            }}
          >
            Email
          </div>
          <div
            style={{
              fontSize: `18px`,
              fontWeight: 500,
              color: '#9aa3b5',
              marginLeft: '16px',
              padding: '4px 8px',
            }}
          >
            Keyword
          </div>
        </div>
        <ProfileForm />
        <div className={s.authFormWrapper}>
          <AuthEditForm />
        </div>
        <div>
          <EmailSettings />
        </div>
      </div>
      <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />
    </>
  );
};

export default withStyles<typeof UserSettings>(s)(UserSettings);
