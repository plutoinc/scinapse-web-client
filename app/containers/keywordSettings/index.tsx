import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ImprovedFooter from '../../components/layouts/improvedFooter';
import { AppState } from '../../reducers';
import { succeedToConnectKeywordSettingsAPI } from '../../reducers/keywordSettings';
import KeywordItemList from '../../components/keywordSettings/keywordItemList';
import CreateKeywordAlertDialog from '../../components/createKeywordAlertDialog/createKeywordAlertDialog';
import { fetchKeywordAlertList, deleteKeywordAlert } from './actions';
import CreateKeywordInput from '../../components/createKeywordInput';
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
        <CreateKeywordInput isLoading={isLoading} isLoggedIn={isLoggedIn} />
        <KeywordItemList
          isLoggedIn={isLoggedIn}
          keywords={keywords}
          onRemoveKeywordItem={handleRemoveKeywordItem}
          isLoading={isLoading}
        />
      </div>
      <CreateKeywordAlertDialog />
      <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />
    </>
  );
};

export default KeywordSettings;
