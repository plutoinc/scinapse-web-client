import { List } from "immutable";
import { IArticlesRecord, IArticleRecord } from "../../model/article";
import { IEvaluationsRecord } from "../../model/evaluation";

export const selectArticle = (articles: IArticlesRecord, targetArticleId: number): IArticleRecord => {
  if (articles && !articles.isEmpty()) {
    const key = articles.findKey(article => {
      return article.id === targetArticleId;
    });
    return articles.get(key) || null;
  }
  return null;
};

export const selectEvaluations = (evaluations: IEvaluationsRecord, ids: List<number>): IEvaluationsRecord => {
  return evaluations
    .filter(evaluation => {
      return ids.includes(evaluation.id);
    })
    .toList();
};
