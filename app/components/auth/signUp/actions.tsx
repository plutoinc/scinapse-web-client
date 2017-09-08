// import { toJS } from "immutable";
import { Dispatch } from "redux";
import apiHelper from '../../../helpers/apiHelper';

export const ACTION_TYPES = {
  CHANGE_EMAIL_INPUT            : 'SIGN_UP.CHANGE_EMAIL_INPUT',
  CHANGE_PASSWORD_INPUT         : 'SIGN_UP.CHANGE_PASSWORD_INPUT',
  CHANGE_REPEAT_PASSWORD_INPUT  : 'SIGN_UP.CHANGE_REPEAT_PASSWORD_INPUT',
  CHANGE_FULL_NAME_INPUT        : 'SIGN_UP.CHANGE_FULL_NAME_INPUT',

  START_TO_CREATE_ACCOUNT       : 'SIGN_UP.START_TO_CREATE_ACCOUNT',
  FAILED_TO_CREATE_ACCOUNT      : 'SIGN_UP.FAILED_TO_CREATE_ACCOUNT',
  SUCCEEDED_TO_CREATE_ACCOUNT   : 'SIGN_UP.SUCCEEDED_TO_CREATE_ACCOUNT',
};

export function changeEmailInput(email:any) {
  return {
    type: ACTION_TYPES.CHANGE_EMAIL_INPUT,
    payload: {
      email,
    },
  };
}

export function changePasswordInput(password:any) {
  return {
    type: ACTION_TYPES.CHANGE_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function changeRepeatPasswordInput(password:any) {
  return {
    type: ACTION_TYPES.CHANGE_REPEAT_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function changeFullNameInput(fullName:string) {
  return {
    type: ACTION_TYPES.CHANGE_FULL_NAME_INPUT,
    payload: {
      fullName,
    },
  };
}
export function createNewAccount(userInfo:Map<string,any>) {
  return async (dispatch: Dispatch<any>) => { // TODO: Change any to specific type
    dispatch({
      type: ACTION_TYPES.START_TO_CREATE_ACCOUNT,
    });
    try {
      console.log('userInfo is ', userInfo);
      // const user = toJS(userInfo);
      const user = userInfo;
      const result = await apiHelper.signUp({
        password: user.get('password'),
        email: user.get('email'),
        fullName: user.get('fullName'),
      });
      console.log('result is ', result);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_CREATE_ACCOUNT,
      });
    } catch (err) {
      console.log('err is ', err);
      dispatch({
        type: ACTION_TYPES.FAILED_TO_CREATE_ACCOUNT,
      });
    }
  };
}
