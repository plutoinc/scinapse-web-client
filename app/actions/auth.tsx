import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import AuthAPI from '../api/auth';
import { UpdateUserInformationParams } from '../api/types/auth';
import { checkAuthStatus } from '../components/auth/actions';
import { AuthActions } from './actionTypes';

// export type ThunkResult<R> = ThunkAction<R, RootState, Services, RootAction>

export const updateUserProfile = (
  params: UpdateUserInformationParams
): ThunkAction<Promise<void>, {}, {}, AuthActions> => {
  return async (dispatch: Dispatch<AuthActions>) => {
    try {
      await AuthAPI.update(params);
      await checkAuthStatus()(dispatch);
    } catch (err) {
      window.alert('Sorry. we had an error to update your profile.');
    }
  };
};
