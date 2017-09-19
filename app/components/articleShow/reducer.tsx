import { IReduxAction } from "../../typings/actionType";
import { ARTICLE_SHOW_INITIAL_STATE, IArticleShowStateRecord, ARTICLE_EVALUATION_TAB } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";

export function reducer(state = ARTICLE_SHOW_INITIAL_STATE, action: IReduxAction<any>): IArticleShowStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_TAB: {
      if (state.evaluationTab === ARTICLE_EVALUATION_TAB.MY) {
        return state.set("evaluationTab", ARTICLE_EVALUATION_TAB.PEER);
      } else {
        return state.set("evaluationTab", ARTICLE_EVALUATION_TAB.MY);
      }
    }

    default:
      return state;
  }
}
