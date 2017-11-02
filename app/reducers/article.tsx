import { List } from "immutable";
import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { ARTICLE_INITIAL_STATE, IArticleRecord, IArticlesRecord } from "../model/article";

export function reducer(state = ARTICLE_INITIAL_STATE, action: IReduxAction<any>): IArticlesRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_CREATE_ARTICLE:
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

    case ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_ARTICLES:
    case ACTION_TYPES.ARTICLE_FEED_SUCCEEDED_TO_GET_ARTICLES: {
      const targetArticles: IArticlesRecord = action.payload.articles;
      const updatedArticlesIdArray: number[] = [];

      const updatedArticlesList = state.map(article => {
        const alreadyExistArticle = targetArticles.find(targetArticle => {
          return targetArticle.id === article.id;
        });

        if (alreadyExistArticle !== undefined) {
          updatedArticlesIdArray.push(alreadyExistArticle.id);
          return alreadyExistArticle;
        } else {
          return article;
        }
      });

      const targetArticlesWithoutUpdatedArticles = targetArticles.filter(article => {
        return !updatedArticlesIdArray.includes(article.id);
      });

      return updatedArticlesList.concat(targetArticlesWithoutUpdatedArticles).toList();
    }

    case ACTION_TYPES.ARTICLE_SHOW_UPDATE_ARTICLE_POINT: {
      const targetArticleId: number = action.payload.articleId;
      const key = state.findKey(article => {
        return article.id === targetArticleId;
      });

      if (key !== undefined) {
        return state.setIn([key, "point"], action.payload.point);
      }
    }

    case ACTION_TYPES.ARTICLE_FEED_CHANGE_SORTING_OPTION: {
      return List();
    }

    default:
      return state;
  }
}
