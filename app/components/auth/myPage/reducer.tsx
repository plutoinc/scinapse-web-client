import { IReduxAction } from "../../../typings/actionType";
import { IMyPageStateRecord, MY_PAGE_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

export function reducer(state = MY_PAGE_INITIAL_STATE, action: IReduxAction<any>): IMyPageStateRecord {
  switch (action.type) {
    case ACTION_TYPES.MY_PAGE_CHANGE_CATEGORY: {
      return state.set("category", action.payload.category);
    }

    default:
      return state;
  }
}
