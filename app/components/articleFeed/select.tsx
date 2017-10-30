import { IArticlesRecord } from "../../model/article";
import { FEED_CATEGORIES } from "./records";

const selectArticles = (articles: IArticlesRecord, feedItemsToShow: IArticlesRecord, category: FEED_CATEGORIES) => {
  return articles.filter(article => {
    if (category === FEED_CATEGORIES.ALL) {
      return feedItemsToShow.some(targetArticle => {
        return targetArticle.id === article.id;
      });
    } else {
      return feedItemsToShow.some(targetArticle => {
        return targetArticle.id === article.id && targetArticle.type === FEED_CATEGORIES[category];
      });
    }
  });
};

export default selectArticles;
