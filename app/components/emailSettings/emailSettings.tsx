import React, { useEffect } from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AuthAPI from '../../api/auth';
import EmailToggleItem from './emailToggleItem';
import { withStyles } from '../../helpers/withStylesHelper';
import reducer, { EmailSettingsInitialState } from './emailSettingsReducer';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import { EmailSettingTypes } from '../../api/types/auth';

const s = require('./emailSettings.scss');

const EmailSettings: React.FC<RouteComponentProps<{ token?: string }>> = ({ location }) => {
  const [state, dispatch] = React.useReducer(reducer, EmailSettingsInitialState);
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);
  const token = qs.parse(location.search, { ignoreQueryPrefix: true }).token;

  useEffect(
    () => {
      // TODO: handle no user and no token situation
      if (!currentUser.isLoggedIn && !token) return;

      dispatch({ type: 'START_TO_FETCHING_SETTINGS' });
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

  // TODO: Add loading
  // if (!state.succeedToFetch) return <loading />;

  // TODO: Add error component
  // below logic is pseudo code. don't trust conditional statement
  // if ((!state.succeedToFetch && !currentUser.isLoggedIn && !token) || state.hasError) return null;

  const handleClickItem = async (type: EmailSettingTypes, nextStatus: boolean) => {
    if (state.activeStatus[type] === nextStatus) return;

    try {
      dispatch({
        type: 'START_TO_UPDATING_SETTING',
        payload: {
          emailSettingTypes: type,
        },
      });
      await AuthAPI.updateEmailSetting({ type, setting: nextStatus });
      dispatch({
        type: 'SUCCEED_TO_UPDATING_SETTING',
        payload: {
          emailSettingTypes: type,
          nextStatus,
        },
      });
    } catch (err) {
      dispatch({
        type: 'FAILED_TO_UPDATING_SETTING',
        payload: {
          emailSettingTypes: type,
        },
      });
    }
  };

  return (
    <>
      <div className={s.divider} />
      <div className={s.title}>Emails from Scinapse</div>
      <EmailToggleItem
        title="Feature Instruction Mail"
        subtitle="Regular introductions on use of Scinapse"
        active={state.activeStatus.FEATURE_INSTRUCTION}
        isLoading={state.updateStatus.FEATURE_INSTRUCTION.isLoading}
        hasFailed={state.updateStatus.FEATURE_INSTRUCTION.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem('FEATURE_INSTRUCTION', nextStatus);
        }}
      />
      <EmailToggleItem
        title="Paper Recommendation Mail"
        subtitle="Send recommendations based on your history"
        active={state.activeStatus.PAPER_RECOMMENDATION}
        isLoading={state.updateStatus.PAPER_RECOMMENDATION.isLoading}
        hasFailed={state.updateStatus.PAPER_RECOMMENDATION.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem('PAPER_RECOMMENDATION', nextStatus);
        }}
      />
      <EmailToggleItem
        title="Collection Remind Mail"
        subtitle="Send an aggregated papers you saved."
        active={state.activeStatus.COLLECTION_REMIND}
        isLoading={state.updateStatus.COLLECTION_REMIND.isLoading}
        hasFailed={state.updateStatus.COLLECTION_REMIND.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem('COLLECTION_REMIND', nextStatus);
        }}
      />
      <EmailToggleItem
        title="Full-text Request Confirmation"
        subtitle="Send a confirmation mail when you request full-text."
        active={state.activeStatus.REQUEST_CONFIRMATION}
        isLoading={state.updateStatus.REQUEST_CONFIRMATION.isLoading}
        hasFailed={state.updateStatus.REQUEST_CONFIRMATION.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem('REQUEST_CONFIRMATION', nextStatus);
        }}
      />
      <div className={s.divider} />
      <EmailToggleItem
        title="All Email"
        subtitle="Control whether to receive email from Scinapse. You’ll still receive administrative emails even if this setting is off."
        active={state.activeStatus.GLOBAL}
        isLoading={state.updateStatus.GLOBAL.isLoading}
        hasFailed={state.updateStatus.GLOBAL.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem('GLOBAL', nextStatus);
        }}
      />
    </>
  );
};

export default withRouter(withStyles<typeof EmailSettings>(s)(EmailSettings));
