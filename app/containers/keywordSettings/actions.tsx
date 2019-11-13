import { Dispatch } from 'redux';
import {
  startToConnectKeywordSettingsAPI,
  succeedToConnectKeywordSettingsAPI,
  failedToConnectKeywordSettingsAPI,
} from '../../reducers/keywordSettings';
import MemberAPI from '../../api/member';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../components/locationListener';
import { openSnackbar, GLOBAL_SNACKBAR_TYPE, closeSnackbar } from '../../reducers/scinapseSnackbar';
import PlutoAxios from '../../api/pluto';
import { ACTION_TYPES } from '../../actions/actionTypes';

export function fetchKeywordAlertList() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(startToConnectKeywordSettingsAPI());

    try {
      const keywordRes = await MemberAPI.getKeywordSettings();
      dispatch(succeedToConnectKeywordSettingsAPI({ keywords: keywordRes.data.content }));
    } catch (err) {
      dispatch(failedToConnectKeywordSettingsAPI());
      const error = PlutoAxios.getGlobalError(err);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: error.message,
        },
      });
    }
  };
}

export function createKeywordAlert(keyword: string, actionArea?: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(startToConnectKeywordSettingsAPI());
    dispatch(closeSnackbar());

    try {
      const keywordRes = await MemberAPI.newKeywordSettings(keyword);
      dispatch(succeedToConnectKeywordSettingsAPI({ keywords: keywordRes.data.content }));
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: 'fire',
        actionArea: actionArea || null,
        actionTag: 'createKeywordAlert',
        actionLabel: keyword,
      });
      dispatch(
        openSnackbar({
          type: GLOBAL_SNACKBAR_TYPE.CREATE_KEYWORD_ALERT,
          collectionId: null,
          context: null,
          actionTicketParams: {
            pageType: getCurrentPageType(),
            actionType: 'view',
            actionArea: 'createKeywordSnackbar',
            actionTag: 'viewCreateKeywordSnackbar',
            actionLabel: keyword,
          },
        })
      );
    } catch (err) {
      dispatch(failedToConnectKeywordSettingsAPI());
      const error = PlutoAxios.getGlobalError(err);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: error.message,
        },
      });
    }
  };
}

export function deleteKeywordAlert(keywordId: string, keyword: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(startToConnectKeywordSettingsAPI());
    dispatch(closeSnackbar());

    try {
      const keywordRes = await MemberAPI.deleteKeywordSettings(keywordId);
      dispatch(succeedToConnectKeywordSettingsAPI({ keywords: keywordRes.data.content }));
      ActionTicketManager.trackTicket({
        pageType: 'keywordSettingPage',
        actionType: 'fire',
        actionArea: 'keywordSettingPage',
        actionTag: 'removeKeywordAlert',
        actionLabel: keyword,
      });
    } catch (err) {
      dispatch(failedToConnectKeywordSettingsAPI());
      const error = PlutoAxios.getGlobalError(err);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: error.message,
        },
      });
    }
  };
}
