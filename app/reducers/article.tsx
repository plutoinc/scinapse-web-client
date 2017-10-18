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

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION: {
      try {
        const { articleId, evaluation } = action.payload;

        const articleKey = state.findKey(article => {
          return article.id === articleId;
        });

        if (articleKey !== undefined) {
          const newEvaluations = state.get(articleKey).evaluations.push(evaluation);
          return state.setIn([articleKey, "evaluations"], newEvaluations);
        } else {
          return state;
        }
      } catch (_err) {
        return state;
      }
    }

    default:
      return state;
  }
}
