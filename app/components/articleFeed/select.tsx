import { createSelector } from "reselect";
import { FEED_CATEGORIES } from "./records";
import { IArticlesRecord } from "../../model/article";

const getArticlesFilter = (_articles: IArticlesRecord, _feedItemsToShow: IArticlesRecord, category: FEED_CATEGORIES) =>
  category;

const getArticles = (articles: IArticlesRecord, feedItemsToShow: IArticlesRecord, _category: FEED_CATEGORIES) => {
  if (articles) {
    return articles.filter(article => {
      return feedItemsToShow.some(targetArticle => article.id === targetArticle.id);
    });
  }
};

const selectArticles = createSelector([getArticlesFilter, getArticles], (filter, articles) => {
  if (articles) {
    if (filter === FEED_CATEGORIES.ALL) {
      return articles;
    } else {
      return articles.filter(article => article.type === FEED_CATEGORIES[filter]);
    }
  }
});

export default selectArticles;
