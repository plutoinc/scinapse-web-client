// import { toJS } from "immutable";
import { Dispatch } from "redux";
import apiHelper from '../../../helpers/apiHelper';
export const ACTION_TYPES = {
  CHANGE_EMAIL_INPUT            : 'SIGN_IN.CHANGE_EMAIL_INPUT',
  CHANGE_PASSWORD_INPUT         : 'SIGN_IN.CHANGE_PASSWORD_INPUT',

  START_TO_SIGN_IN       : 'SIGN_IN.START_TO_SIGN_IN',
  FAILED_TO_SIGN_IN      : 'SIGN_IN.FAILED_TO_SIGN_IN',
  SUCCEEDED_TO_SIGN_IN   : 'SIGN_IN.SUCCEEDED_TO_SIGN_IN',
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

export function signIn(userInfo:Map<string,any>) {
  return async (dispatch: Dispatch<any>) => { // TODO: Change any to specific type
    dispatch({
      type: ACTION_TYPES.START_TO_SIGN_IN,
    });
    try {
      console.log('userInfo is ', userInfo);
      // const user = toJS(userInfo);
      const user = userInfo;
      const result = await apiHelper.signIn({
        password: user.get('password'),
        email: user.get('email'),
      });
      console.log('result is ', result);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_SIGN_IN,
      });
    } catch (err) {
      console.log('err is ', err);
      dispatch({
        type: ACTION_TYPES.FAILED_TO_SIGN_IN,
      });
    }
  };
}
