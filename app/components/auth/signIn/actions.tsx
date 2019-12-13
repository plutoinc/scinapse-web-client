import { Dispatch } from 'redux';
import AuthAPI from '../../../api/auth';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { closeDialog } from '../../dialog/actions';
import alertToast from '../../../helpers/makePlutoToastAction';
import { SignInWithEmailParams, SignInResult, OAUTH_VENDOR } from '../../../api/types/auth';
import { trackDialogView } from '../../../helpers/handleGA';
import PlutoAxios from '../../../api/pluto';

export function signInWithSocial(vendor: OAUTH_VENDOR, accessToken: string) {
  return async (dispatch: Dispatch<any>) => {
    const user = await AuthAPI.loginWithOAuth(vendor, accessToken);
    dispatch({
      type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
      payload: {
        user: user.member,
        loggedIn: user.loggedIn,
        oauthLoggedIn: user.oauthLoggedIn,
        token: user.token,
      },
    });
  };
}

export function signInWithEmail(params: SignInWithEmailParams, isDialog: boolean) {
  return async (dispatch: Dispatch<any>) => {
    const { email, password } = params;

    try {
      const signInResult: SignInResult = await AuthAPI.signInWithEmail({ email, password });

      if (isDialog) {
        dispatch(closeDialog());
        trackDialogView('signInWithEmailClose');
      }

      alertToast({
        type: 'success',
        message: 'Welcome to Scinapse',
      });

      dispatch({
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: signInResult.member,
          loggedIn: signInResult.loggedIn,
          oauthLoggedIn: signInResult.oauthLoggedIn,
          token: signInResult.token,
        },
      });
      return signInResult;
    } catch (err) {
      alertToast({
        type: 'error',
        message: `Failed to sign in.`,
      });
      const error = PlutoAxios.getGlobalError(err);
      throw error;
    }
  };
}
