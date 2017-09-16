import { IReduxAction } from "../../typings/actionType";
import { ARTICLE_SHOW_INITIAL_STATE, IArticleShowStateRecord } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = ARTICLE_SHOW_INITIAL_STATE, action: IReduxAction<any>): IArticleShowStateRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT: {
      return state;
      // return state.set("email", action.payload.email);
    }
  }
}
