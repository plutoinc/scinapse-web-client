import { IReduxAction } from "../../../typings/actionType";
import { IMyPageStateRecord, MY_PAGE_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(state = MY_PAGE_INITIAL_STATE, action: IReduxAction<any>): IMyPageStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT: {
      return state.set("email", action.payload.email);
    }

    default:
      return state;
  }
}
