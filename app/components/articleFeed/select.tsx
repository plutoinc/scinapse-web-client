import { FEED_CATEGORIES, IArticleFeedStateRecord } from "./records";
import createImmutableEqualSelector from "../../helpers/createImmutableEqualSelector";
import { IArticlesRecord } from "../../model/article";

const getArticlesFilter = (_articles: IArticlesRecord, articleFeed: IArticleFeedStateRecord) => {
  return articleFeed.category;
};

const getArticles = (articles: IArticlesRecord, articleFeed: IArticleFeedStateRecord) => {
  if (articles) {
    return articles.filter(article => {
      return articleFeed.feedItemsToShow.some(targetArticle => article.id === targetArticle.id);
    });
  }
};

const selectArticles = createImmutableEqualSelector([getArticlesFilter, getArticles], (filter, articles) => {
  if (articles) {
    if (filter === FEED_CATEGORIES.ALL) {
      return articles;
    } else {
      return articles.filter(article => article.type === FEED_CATEGORIES[filter]);
    }
  }
});

export default selectArticles;
