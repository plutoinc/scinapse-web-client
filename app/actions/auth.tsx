import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import AuthAPI from '../api/auth';
import { ChangePasswordParams, UpdateUserInformationParams, UpdateUserInformationAPIParams } from '../api/types/auth';
import { checkAuthStatus } from '../components/auth/actions';
import { AuthActions } from './actionTypes';
import { parseProfileLink } from '../components/auth/signUp/actions';

export const updateUserProfile = (
  params: UpdateUserInformationParams
): ThunkAction<Promise<void>, {}, {}, AuthActions> => {
  return async (dispatch: Dispatch<AuthActions>) => {
    const { profileLink, ...signUpParams } = params;
    let profileParams = parseProfileLink(profileLink);
    let finalParams: UpdateUserInformationAPIParams = {
      affiliation_id: params.affiliation.id || null,
      affiliation_name: signUpParams.affiliation.name,
      first_name: signUpParams.firstName,
      last_name: signUpParams.lastName,
    };
    if (profileParams) {
      finalParams = { ...finalParams, ...profileParams };
    }
    await AuthAPI.update(finalParams);
    await checkAuthStatus()(dispatch);
  };
};

export const changePassword = (params: ChangePasswordParams) => {
  return async (dispatch: Dispatch<AuthActions>) => {
    await AuthAPI.changePassword(params);
    await checkAuthStatus()(dispatch);
  };
};
