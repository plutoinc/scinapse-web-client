import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import { AppState } from '../../reducers';
import {
  startToConnectKeywordSettingsAPI,
  succeedToConnectKeywordSettingsAPI,
  failedToConnectKeywordSettingsAPI,
} from '../../reducers/keywordSettings';
import MemberAPI from '../../api/member';
import KeywordItemList from '../../components/keywordSettings/keywordItemList';
import Button from '../../components/common/button';
import Icon from '../../icons';
import { ACTION_TYPES } from '../../actions/actionTypes';
import CreateKeywordAlertDialog from '../../components/createKeywordAlertDialog/createKeywordAlertDialog';
import { openCreateKeywordAlertDialog } from '../../reducers/createKeywordAlertDialog';
import ActionTicketManager from '../../helpers/actionTicketManager';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import PlutoAxios from '../../api/pluto';
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

      dispatch(startToConnectKeywordSettingsAPI());
      MemberAPI.getKeywordSettings()
        .then(res => {
          dispatch(succeedToConnectKeywordSettingsAPI({ keywords: res.data.content }));
        })
        .catch(err => {
          dispatch(failedToConnectKeywordSettingsAPI());
          const error = PlutoAxios.getGlobalError(err);
          dispatch({
            type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
            payload: {
              type: 'error',
              message: error.message,
            },
          });
        });
    },
    [isLoggedIn, dispatch]
  );

  const handleRemoveKeywordItem = useCallback((keywordId: string, keyword: string) => {
    dispatch(startToConnectKeywordSettingsAPI());
    MemberAPI.deleteKeywordSettings(keywordId)
      .then(res => {
        dispatch(succeedToConnectKeywordSettingsAPI({ keywords: res.data.content }));
        ActionTicketManager.trackTicket({
          pageType: 'keywordSettingPage',
          actionType: 'fire',
          actionArea: 'keywordSettingPage',
          actionTag: 'removeKeywordAlert',
          actionLabel: keyword,
        });
      })
      .catch(err => {
        dispatch(failedToConnectKeywordSettingsAPI());
        const error = PlutoAxios.getGlobalError(err);
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: 'error',
            message: error.message,
          },
        });
      });
  }, []);

  return (
    <>
      <div className={s.wrapper}>
        <h1 className={s.title}>My research interests</h1>
        <div className={s.divider} />
        <div className={s.subTitle}>Keyword alerts</div>
        <div className={s.context}>We’ll send email related or latest papers for the registered keyword.</div>
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
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType: 'keywordSettingPage',
              actionType: 'fire',
              actionArea: 'keywordSettingPage',
              actionTag: 'clickCreateAlertBtn',
              actionLabel: null,
            });

            if (!isLoggedIn)
              return GlobalDialogManager.openSignUpDialog({
                authContext: {
                  pageType: 'keywordSettingPage',
                  actionArea: 'createAlertBtn',
                  actionLabel: null,
                },
                isBlocked: false,
              });

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
