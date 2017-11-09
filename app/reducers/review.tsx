import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { IReviewsRecord, REVIEWS_INITIAL_STATE, IReviewRecord } from "../model/review";

export function reducer(state = REVIEWS_INITIAL_STATE, action: IReduxAction<any>): IReviewsRecord {
  switch (action.type) {
    case ACTION_TYPES.SUCCEEDED_TO_FETCH_REVIEWS: {
      const targetReviews: IReviewsRecord = action.payload.reviews;
      const updatedReviewsIdArray: number[] = [];

      const updatedReviewsList = state.map(review => {
        const alreadyExistReview = targetReviews.find(targetReview => {
          return targetReview.id === review.id;
        });

        if (alreadyExistReview !== undefined) {
          updatedReviewsIdArray.push(alreadyExistReview.id);
          return alreadyExistReview;
        } else {
          return review;
        }
      });

      const targetReviewsWithoutUpdatedReviews = targetReviews.filter(review => {
        return !updatedReviewsIdArray.includes(review.id);
      });

      return updatedReviewsList.concat(targetReviewsWithoutUpdatedReviews).toList();
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_REVIEW: {
      const { reviewId } = action.payload;

      const reviewKey = state.findKey((review: IReviewRecord) => {
        return review.id === reviewId;
      });

      const currentVoteCount = state.getIn([reviewKey, "vote"]);

      return state.withMutations(currentState => {
        currentState.setIn([reviewKey, "voted"], true).setIn([reviewKey, "vote"], currentVoteCount + 1);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_REVIEW: {
      const { reviewId } = action.payload;

      const reviewKey = state.findKey((review: IReviewRecord) => {
        return review.id === reviewId;
      });
      const currentVoteCount = state.getIn([reviewKey, "vote"]);

      return state.withMutations(currentState => {
        currentState.setIn([reviewKey, "voted"], false).setIn([reviewKey, "vote"], currentVoteCount - 1);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_UNVOTE_PEER_REVIEW: {
      const { reviewId } = action.payload;

      const reviewKey = state.findKey((review: IReviewRecord) => {
        return review.id === reviewId;
      });

      const currentVoteCount = state.getIn([reviewKey, "vote"]);

      return state.withMutations(currentState => {
        currentState.setIn([reviewKey, "voted"], false).setIn([reviewKey, "vote"], currentVoteCount - 1);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_UNVOTE_PEER_REVIEW: {
      const { reviewId } = action.payload;

      const reviewKey = state.findKey((review: IReviewRecord) => {
        return review.id === reviewId;
      });
      const currentVoteCount = state.getIn([reviewKey, "vote"]);

      return state.withMutations(currentState => {
        currentState.setIn([reviewKey, "voted"], true).setIn([reviewKey, "vote"], currentVoteCount + 1);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_REVIEW: {
      const { review } = action.payload;
      return state.push(review);
    }

    default:
      return state;
  }
}
