import { FEED_CATEGORIES } from "./records";
import { IAppState } from "../../reducers/index";
import { IArticleFeedContainerProps } from "./index";
import createImmutableEqualSelector from "../../helpers/createImmutableEqualSelector";

const getArticlesFilter = (state: IAppState, _props: IArticleFeedContainerProps) => {
  return state.articleFeed.category;
};

const getArticles = (state: IAppState, _props: IArticleFeedContainerProps) => {
  if (state.articles) {
    return state.articles.filter(article => {
      return state.articleFeed.feedItemsToShow.some(targetArticle => article.id === targetArticle.id);
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
