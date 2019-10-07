import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import { AppState } from '../../reducers';
import { succeedToConnectKeywordSettingsAPI } from '../../reducers/keywordSettings';
import KeywordItemList from '../../components/keywordSettings/keywordItemList';
import Button from '../../components/common/button';
import Icon from '../../icons';
import CreateKeywordAlertDialog from '../../components/createKeywordAlertDialog/createKeywordAlertDialog';
import { openCreateKeywordAlertDialog } from '../../reducers/createKeywordAlertDialog';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../helpers/checkAuthDialog';
import { fetchKeywordAlertList, deleteKeywordAlert } from './actions';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./keywordSettings.scss');

const KeywordSettings: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading, keywords } = useSelector((appState: AppState) => ({
    isLoggedIn: appState.currentUser.isLoggedIn,
    isLoading: appState.keywordSettingsState.isLoading,
    keywords: appState.keywordSettingsState.keywords,
  }));

  useEffect(
    () => {
      if (!isLoggedIn) {
        dispatch(succeedToConnectKeywordSettingsAPI({ keywords: [] }));
        return;
      }

      dispatch(fetchKeywordAlertList());
    },
    [isLoggedIn, dispatch]
  );

  const handleRemoveKeywordItem = useCallback(
    (keywordId: string, keyword: string) => {
      dispatch(deleteKeywordAlert(keywordId, keyword));
    },
    [dispatch]
  );

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.title}>Keyword alerts</div>
        <div className={s.context}>We’ll send email updated papers for the registered keyword.</div>
        <KeywordItemList
          isLoggedIn={isLoggedIn}
          keywords={keywords}
          onRemoveKeywordItem={handleRemoveKeywordItem}
          isLoading={isLoading}
        />
        <Button
          elementType="button"
          size="large"
          variant="contained"
          color="blue"
          style={{ marginTop: '24px' }}
          isLoading={isLoading}
          disabled={isLoading}
          onClick={async () => {
            ActionTicketManager.trackTicket({
              pageType: 'keywordSettingPage',
              actionType: 'fire',
              actionArea: 'keywordSettingPage',
              actionTag: 'clickCreateAlertBtn',
              actionLabel: 'clickCreateAlertBtn',
            });

            const isBlocked = await blockUnverifiedUser({
              authLevel: AUTH_LEVEL.UNVERIFIED,
              actionArea: 'keywordSettingPage',
              actionLabel: 'clickCreateAlertBtn',
              userActionType: 'clickCreateAlertBtn',
            });

            if (isBlocked) return;

            dispatch(openCreateKeywordAlertDialog({ from: 'keywordSettingPage', keyword: '' }));
          }}
        >
          <Icon icon="PLUS" />
          <span>Create alert</span>
        </Button>
      </div>
      <CreateKeywordAlertDialog />
      <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />
    </>
  );
};

export default KeywordSettings;
