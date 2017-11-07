import { List } from "immutable";
import { createSelector } from "reselect";
import { IArticlesRecord, IArticleRecord } from "../../model/article";
import { IReviewsRecord } from "../../model/review";

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

const getReviews = (reviews: IReviewsRecord, reviewIdsToShow: List<number>) => {
  if (reviews && !reviews.isEmpty()) {
    return reviews.filter(review => reviewIdsToShow.includes(review.id));
  } else {
    return null;
  }
};

export const selectReviews = createSelector([getReviews], getReviews => {
  if (getReviews && getReviews.count() > 0) {
    return getReviews.sort((a, b) => {
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
