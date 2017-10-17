import { IArticlesRecord } from "../../model/article";

const selectArticles = (articles: IArticlesRecord, feedItemsToShow: IArticlesRecord) => {
  return articles.filter(article => {
    return feedItemsToShow.some(targetArticle => {
      return targetArticle.id === article.id;
    });
  });
};

export default selectArticles;
