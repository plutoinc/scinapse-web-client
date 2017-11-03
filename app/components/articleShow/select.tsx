import { List } from "immutable";
import { createSelector } from "reselect";
import { IArticlesRecord, IArticleRecord } from "../../model/article";
import { IEvaluationsRecord } from "../../model/evaluation";

export const getArticle = (articles: IArticlesRecord, targetArticleId: number): IArticleRecord => {
  if (articles && !articles.isEmpty()) {
    const key = articles.findKey(article => {
      return article.id === targetArticleId;
    });
    return articles.get(key) || null;
  }
  return null;
};

export const selectArticle = createSelector([getArticle], article => {
  return article;
});

const getEvaluations = (evaluations: IEvaluationsRecord, evaluationIdsToShow: List<number>) => {
  if (evaluations && !evaluations.isEmpty()) {
    return evaluations.filter(evaluation => evaluationIdsToShow.includes(evaluation.id));
  } else {
    return null;
  }
};

export const selectEvaluations = createSelector([getEvaluations], getEvaluations => {
  if (getEvaluations && getEvaluations.count() > 0) {
    return getEvaluations.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      if (dateA === dateB) {
        return 0;
      }
    });
  } else {
    return List();
  }
});
