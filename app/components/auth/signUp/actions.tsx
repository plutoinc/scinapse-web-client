import { Dispatch } from 'redux';
import AuthAPI from '../../../api/auth';
import {
  SignUpWithEmailParams,
  SignUpWithSocialParams,
  SignUpWithSocialAPIParams,
  SignUpWithEmailAPIParams,
} from '../../../api/types/auth';
import RecommendationAPI from '../../../api/recommendation';
import { RECOMMENDED_PAPER_LOGGING_FOR_NON_USER } from '../../recommendPool/constants';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import alertToast from '../../../helpers/makePlutoToastAction';
import EnvChecker from '../../../helpers/envChecker';
import { Member } from '../../../model/member';
import { RecommendationActionParams } from '../../../api/types/recommendation';
const store = require('store');

async function syncRecommendationPoolToUser() {
  const targetActions: RecommendationActionParams[] = store.get(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER) || [];

  if (targetActions.length > 0) {
    const reqParams = targetActions.map(targetAction => {
      return { paper_id: targetAction.paperId, action: targetAction.action };
    });
    await RecommendationAPI.syncRecommendationPool(reqParams);
    store.remove(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER);
  }
}

export const checkDuplicatedEmail = async (email: string) => {
  const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);
  if (checkDuplicatedEmailResult.duplicated) {
    return 'Email address already exists';
  }
  return null;
};

export function signUpWithSocial(params: SignUpWithSocialParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const finalParams: SignUpWithSocialAPIParams = {
        email: params.email,
        affiliation_name: params.affiliation,
        first_name: params.firstName,
        last_name: params.lastName,
        token: params.token,
        affiliation_id: params.affiliationId,
        profile_link: params.profileLink || null,
      };

      const signUpResult: Member = await AuthAPI.signUpWithSocial(finalParams);
      await syncRecommendationPoolToUser();
      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signUpResult,
          loggedIn: true,
          oauthLoggedIn: true,
        },
      });
    } catch (err) {
      alertToast({
        type: 'error',
        message: `Failed to sign up!`,
      });
      throw err;
    }
  };
}

export function signUpWithEmail(params: SignUpWithEmailParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const finalParams: SignUpWithEmailAPIParams = {
        email: params.email,
        affiliation_name: params.affiliation,
        first_name: params.firstName,
        last_name: params.lastName,
        password: params.password,
        affiliation_id: params.affiliationId,
        profile_link: params.profileLink || null,
      };

      const signUpResult: Member = await AuthAPI.signUpWithEmail(finalParams);
      await syncRecommendationPoolToUser();
      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signUpResult,
          loggedIn: true,
          oauthLoggedIn: false,
        },
      });
      alertToast({
        type: 'success',
        message: 'Succeeded to Sign Up',
      });
    } catch (err) {
      alertToast({
        type: 'error',
        message: `Failed to sign up with email.`,
      });
      throw err;
    }
  };
}

export function handleClickORCIDBtn() {
  if (!EnvChecker.isOnServer()) {
    const popup = window.open(
      'https://orcid.org/oauth/authorize?client_id=APP-BLJ5M8060XBHF7IR&response_type=token&scope=openid&redirect_uri=https://scinapse.io/',
      'orcidpopup',
      'width=800, height=600, toolbar=0, location=0, status=1, scrollbars=1, resizable=1'
    );

    const windowCheckInterval = setInterval(() => {
      windowCheck();
    }, 300);

    function windowCheck() {
      if (!popup || popup.closed) {
        clearInterval(windowCheckInterval);
        window.location.reload();
      }
    }
  }
}
