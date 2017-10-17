import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { CURRENT_USER_INITIAL_STATE, ICurrentUserRecord, recordifyCurrentUser } from "../model/currentUser";

export function reducer(state = CURRENT_USER_INITIAL_STATE, action: IReduxAction<any>): ICurrentUserRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return recordifyCurrentUser(action.payload.user).set("isLoggedIn", true);
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return CURRENT_USER_INITIAL_STATE;
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      return recordifyCurrentUser(action.payload.user).set("isLoggedIn", true);
    }

    case ACTION_TYPES.PROFILE_UPDATE_CURRENT_USER_PROFILE_IMAGE: {
      return state.set("profileImage", action.payload.profileImage);
    }

    case ACTION_TYPES.PROFILE_UPDATE_CURRENT_USER_INSTITUTION: {
      return state.set("institution", action.payload.institution);
    }

    case ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT: {
      return state.set("major", action.payload.major);
    }

    default:
      return state;
  }
}
