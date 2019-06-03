import { Dispatch } from 'redux';
import AuthAPI from '../../../api/auth';
import { SignUpWithEmailParams, SignUpWithSocialParams } from '../../../api/types/auth';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import alertToast from '../../../helpers/makePlutoToastAction';
import EnvChecker from '../../../helpers/envChecker';
import { Member } from '../../../model/member';

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
      const signUpResult: Member = await AuthAPI.signUpWithSocial(params);
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
      const signUpResult: Member = await AuthAPI.signUpWithEmail(params);
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
        message: 'Succeeded to Sign Up!!',
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
