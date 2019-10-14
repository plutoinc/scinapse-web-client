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
      if (!currentUser.isLoggedIn && !token) return;

      dispatch({ type: 'START_TO_FETCHING_SETTINGS' });
      AuthAPI.getEmailSettings(token)
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

  if ((!state.succeedToFetch && !currentUser.isLoggedIn && !token) || state.failedToFetch) return null;

  const handleClickItem = async (token: string, type: EmailSettingTypes, nextStatus: boolean) => {
    if (state.activeStatus[type] === nextStatus) return;

    try {
      dispatch({
        type: 'START_TO_UPDATING_SETTING',
        payload: {
          emailSettingTypes: type,
        },
      });
      await AuthAPI.updateEmailSetting({ token, type, setting: nextStatus });
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
      <div className={s.title}>Emails from Scinapse</div>
      <EmailToggleItem
        title="Paper Recommendation Mail"
        subtitle="Send recommendations based on your history"
        active={state.activeStatus.PAPER_RECOMMENDATION}
        isLoading={state.updateStatus.PAPER_RECOMMENDATION.isLoading || !state.succeedToFetch}
        hasFailed={state.updateStatus.PAPER_RECOMMENDATION.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem(token, 'PAPER_RECOMMENDATION', nextStatus);
        }}
        globalInActive={!state.activeStatus.GLOBAL}
      />
      <EmailToggleItem
        title="Collection Remind Mail"
        subtitle="Send an aggregated papers you saved."
        active={state.activeStatus.COLLECTION_REMIND}
        isLoading={state.updateStatus.COLLECTION_REMIND.isLoading || !state.succeedToFetch}
        hasFailed={state.updateStatus.COLLECTION_REMIND.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem(token, 'COLLECTION_REMIND', nextStatus);
        }}
        globalInActive={!state.activeStatus.GLOBAL}
      />
      <EmailToggleItem
        title="Full-text Request Confirmation"
        subtitle="Send a confirmation mail when you request full-text."
        active={state.activeStatus.REQUEST_CONFIRMATION}
        isLoading={state.updateStatus.REQUEST_CONFIRMATION.isLoading || !state.succeedToFetch}
        hasFailed={state.updateStatus.REQUEST_CONFIRMATION.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem(token, 'REQUEST_CONFIRMATION', nextStatus);
        }}
        globalInActive={!state.activeStatus.GLOBAL}
      />
      <EmailToggleItem
        title="Last Week Activity"
        subtitle="Send a usage report about your last week Scinapse activity."
        active={state.activeStatus.LAST_WEEK_ACTIVITY}
        isLoading={state.updateStatus.LAST_WEEK_ACTIVITY.isLoading || !state.succeedToFetch}
        hasFailed={state.updateStatus.LAST_WEEK_ACTIVITY.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem(token, 'LAST_WEEK_ACTIVITY', nextStatus);
        }}
        globalInActive={!state.activeStatus.GLOBAL}
      />
      <div className={s.divider} />
      <EmailToggleItem
        title="All Email"
        subtitle="Control whether to receive email from Scinapse. You’ll still receive administrative emails even if this setting is off."
        active={state.activeStatus.GLOBAL}
        isLoading={state.updateStatus.GLOBAL.isLoading || !state.succeedToFetch}
        hasFailed={state.updateStatus.GLOBAL.hasFailed}
        onClick={(nextStatus: boolean) => {
          handleClickItem(token, 'GLOBAL', nextStatus);
        }}
      />
    </>
  );
};

export default withRouter(withStyles<typeof EmailSettings>(s)(EmailSettings));
