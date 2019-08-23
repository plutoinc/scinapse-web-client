import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AuthAPI from '../../api/auth';
import EmailToggleItem from './emailToggleItem';
import { withStyles } from '../../helpers/withStylesHelper';
import reducer, { EmailSettingsInitialState } from './emailSettingsReducer';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
const s = require('./emailSettings.scss');

const EmailSettings: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, EmailSettingsInitialState);
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);

  useEffect(
    () => {
      dispatch({ type: 'START_TO_FETCHING_SETTINGS' });

      // if (!currentUser) throw new Error('invalid access. there is no user and token');

      AuthAPI.getEmailSettings()
        .then(res => {
          dispatch({
            type: 'SUCCEED_TO_FETCHING_SETTINGS',
            payload: {
              settings: res.data.content,
            },
          });
        })
        .catch(err => {
          console.error(err);
          dispatch({ type: 'FAILED_TO_FETCHING_SETTINGS' });
        });
    },
    [currentUser]
  );

  console.log(state);

  return (
    <>
      <div className={s.divider} />
      <div className={s.title}>Emails from Scinapse</div>
      <EmailToggleItem
        title="Feature Instruction Mail"
        subtitle="Regular introductions on use of Scinapse"
        active={state.activeStatus.FEATURE_INSTRUCTION}
      />
      <EmailToggleItem
        title="Paper Recommendation Mail"
        subtitle="Send recommendations based on your history"
        active={state.activeStatus.PAPER_RECOMMENDATION}
      />
      <EmailToggleItem
        title="Collection Remind Mail"
        subtitle="Send an aggregated papers you saved."
        active={state.activeStatus.COLLECTION_REMIND}
      />
      <EmailToggleItem
        title="Full-text Request Confirmation"
        subtitle="Send a confirmation mail when you request full-text."
        active={state.activeStatus.REQUEST_CONFIRMATION}
      />
      <div className={s.divider} />
      <EmailToggleItem
        title="All Email"
        subtitle="Control whether to receive email from Scinapse. You’ll still receive administrative emails even if this setting is off."
        active={state.activeStatus.GLOBAL}
      />
    </>
  );
};

export default withStyles<typeof EmailSettings>(s)(EmailSettings);
