import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { ARTICLE_INITIAL_STATE, IArticleStateRecord, recordifyArticle } from "../model/article";

export function reducer(state = ARTICLE_INITIAL_STATE, action: IReduxAction<any>): IArticleStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE: {
      return recordifyArticle(action.payload.article);
    }

    default:
      return state;
  }
}
