import { IReduxAction } from "../../typings/actionType";
import { ARTICLE_CREATE_INITIAL_STATE, IArticleCreateStateRecord } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = ARTICLE_CREATE_INITIAL_STATE, action: IReduxAction<any>): IArticleCreateStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP: {
      return state.set("currentStep", action.payload.step);
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return ARTICLE_CREATE_INITIAL_STATE;
    }

    default:
      return state;
  }
}
