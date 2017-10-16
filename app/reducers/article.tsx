import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { ARTICLE_INITIAL_STATE, IArticleRecord, IArticlesRecord } from "../model/article";

export function reducer(state = ARTICLE_INITIAL_STATE, action: IReduxAction<any>): IArticlesRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE: {
      const targetArticle: IArticleRecord = action.payload.article;
      const key = state.findKey(article => {
        return article.id === targetArticle.id;
      });

      if (key !== undefined) {
        return state.set(key, targetArticle);
      } else {
        return state.push(targetArticle);
      }
    }

    default:
      return state;
  }
}
