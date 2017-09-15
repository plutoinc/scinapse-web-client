import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import {
  CURRENT_USER_INITIAL_STATE,
  ICurrentUserStateRecord,
  CurrentUserStateFactory
} from "../model/currentUser";

export function reducer(
  state = CURRENT_USER_INITIAL_STATE,
  action: IReduxAction<any>
): ICurrentUserStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return CurrentUserStateFactory(action.payload.user);
    }

    case ACTION_TYPES.SIGN_OUT_SUCCEEDED_TO_SIGN_OUT: {
      return CURRENT_USER_INITIAL_STATE;
    }

    default:
      return state;
  }
}
