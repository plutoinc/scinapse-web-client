import { createSelector } from "reselect";
import { List } from "immutable";
import { IReviewsRecord } from "../../model/review";

const getReviews = (reviews: IReviewsRecord, reviewsToShow: List<number>, userId: number) => {
  if (reviews && !reviews.isEmpty()) {
    return reviews.filter(review => {
      return reviewsToShow.some(reviewId => {
        return reviewId === review.id && review.createdBy.id === userId;
      });
    });
  } else {
    return null;
  }
};

const selectReviews = createSelector([getReviews], getReviews => {
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

export default selectReviews;
