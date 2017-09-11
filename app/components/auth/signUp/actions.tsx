import { Dispatch } from "redux";
import apiHelper from "../../../helpers/apiHelper";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
    payload: {
      email,
    },
  };
}

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function changeRepeatPasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function changeFullNameInput(fullName: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_FULL_NAME_INPUT,
    payload: {
      fullName,
    },
  };
}

export interface ICreateNewAccountParams {
  fullName: string;
  email: string;
  password: string;
}

export function createNewAccount(params: ICreateNewAccountParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
    });
    try {
      await apiHelper.signUp({
        password: params.password,
        email: params.email,
        fullName: params.fullName,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
      });
    }
  };
}
