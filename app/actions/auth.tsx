import { Dispatch } from 'redux';
import AuthAPI from '../api/auth';
import { ChangePasswordParams, UpdateUserInformationParams } from '../api/types/auth';
import { checkAuthStatus } from '../components/auth/actions';
import { ACTION_TYPES } from './actionTypes';
import PlutoAxios from '../api/pluto';

export const updateUserProfile = (params: UpdateUserInformationParams) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await AuthAPI.update({
        affiliation_id: params.affiliation.id || null,
        affiliation_name: params.affiliation.name,
        first_name: params.firstName,
        last_name: params.lastName,
        profile_link: params.profileLink,
      });
      await checkAuthStatus()(dispatch);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Successfully changed your profile.',
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'Sorry. we had an error to update your profile.',
        },
      });

      throw err;
    }
  };
};

export const resendVerificationEmail = (email: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (email) {
        await AuthAPI.resendVerificationEmail(email);
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: 'success',
            message: 'Successfully sent E-Mail. Please check your mail box.',
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'Sorry. we had an error during resending the verification email.',
        },
      });
    }
  };
};

export const changePassword = (params: ChangePasswordParams) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await AuthAPI.changePassword(params);
      await checkAuthStatus()(dispatch);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Successfully changed password.',
        },
      });
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.log(error);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'Sorry. we had an error to change password.',
        },
      });
    }
  };
};
