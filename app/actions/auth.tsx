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
    await AuthAPI.update(params);
    await checkAuthStatus()(dispatch);
  };
};

export const changePassword = (params: ChangePasswordParams) => {
  return async (dispatch: Dispatch<AuthActions>) => {
    await AuthAPI.changePassword(params);
    await checkAuthStatus()(dispatch);
  };
};
