import { IArticlesRecord, IArticleRecord } from "../../model/article";

const selectArticle = (articles: IArticlesRecord, targetArticleId: number): IArticleRecord => {
  if (articles && !articles.isEmpty()) {
    const key = articles.findKey(article => {
      return article.id === targetArticleId;
    });
    return articles.get(key) || null;
  }
  return null;
};

export default selectArticle;
