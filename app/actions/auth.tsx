import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import AuthAPI from '../api/auth';
import { ChangePasswordParams, UpdateUserInformationParams } from '../api/types/auth';
import { checkAuthStatus } from '../components/auth/actions';
import { AuthActions } from './actionTypes';

export const updateUserProfile = (
  params: UpdateUserInformationParams
): ThunkAction<Promise<void>, {}, {}, AuthActions> => {
  return async (dispatch: Dispatch<AuthActions>) => {
    await AuthAPI.update({
      affiliation_id: params.affiliation.id || null,
      affiliation_name: params.affiliation.name,
      first_name: params.firstName,
      last_name: params.lastName,
      profile_link: params.profileLink,
    });
    await checkAuthStatus()(dispatch);
  };
};

export const changePassword = (params: ChangePasswordParams) => {
  return async (dispatch: Dispatch<AuthActions>) => {
    await AuthAPI.changePassword(params);
    await checkAuthStatus()(dispatch);
  };
};
