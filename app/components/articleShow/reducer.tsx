import { IReduxAction } from "../../typings/actionType";
import { ARTICLE_SHOW_INITIAL_STATE, IArticleShowStateRecord, ARTICLE_REVIEW_STEP } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { IReviewsRecord } from "../../model/review";
import { ICommentRecord } from "../../model/comment";

export function reducer(state = ARTICLE_SHOW_INITIAL_STATE, action: IReduxAction<any>): IArticleShowStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT: {
      let peerReviewId: string = null;
      if (state.peerReviewId !== action.payload.peerReviewId) {
        peerReviewId = action.payload.peerReviewId;
      }
      return state.set("peerReviewId", peerReviewId);
    }

    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_STEP: {
      return state.set("currentStep", action.payload.step);
    }

    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_SCORE: {
      switch (action.payload.step) {
        case ARTICLE_REVIEW_STEP.FIRST: {
          return state.set("myOriginalityScore", action.payload.score);
        }

        case ARTICLE_REVIEW_STEP.SECOND: {
          return state.set("mySignificanceScore", action.payload.score);
        }
        case ARTICLE_REVIEW_STEP.THIRD: {
          return state.set("myValidityScore", action.payload.score);
        }
        case ARTICLE_REVIEW_STEP.FOURTH: {
          return state.set("myOrganizationScore", action.payload.score);
        }

        default:
          break;
      }
    }

    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_INPUT: {
      return state.set("reviewInput", action.payload.review);
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_REVIEW: {
      return state.withMutations(currentState => {
        return currentState.set("isReviewSubmitLoading", true).set("hasReviewSubmitError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_REVIEW: {
      return state.withMutations(currentState => {
        return currentState.set("isReviewSubmitLoading", false).set("hasReviewSubmitError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_REVIEW: {
      return state.withMutations(currentState => {
        return currentState
          .set("reviewIdsToShow", currentState.reviewIdsToShow.push(action.payload.review.id))
          .set("isReviewSubmitLoading", false)
          .set("hasReviewSubmitError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_ARTICLE: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_ARTICLE: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_REVIEW_COMMENT_SUBMIT: {
      return state.withMutations(currentState => {
        return currentState.set("reviewCommentHasError", false).set("reviewCommentIsLoading", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_REVIEW_COMMENT_SUBMIT: {
      return state.withMutations(currentState => {
        const newCommentStates = currentState.commentStates.push({
          reviewId: action.payload.reviewId,
          isLoading: true,
          isEnd: false,
          page: 0,
          commentIdsToShow: [action.payload.comment.id],
        });

        return currentState
          .set("commentStates", newCommentStates)
          .set("reviewCommentHasError", false)
          .set("reviewCommentIsLoading", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_PEER_REVIEW_COMMENT_SUBMIT: {
      return state.withMutations(currentState => {
        return currentState.set("reviewCommentHasError", true).set("reviewCommentIsLoading", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_REVIEWS: {
      return state.withMutations(currentState => {
        return currentState.set("isReviewLoading", true).set("hasReviewError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_REVIEWS: {
      return state.withMutations(currentState => {
        return currentState.set("isReviewLoading", false).set("hasReviewError", true);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_FETCH_REVIEWS: {
      return state.withMutations(currentState => {
        const reviews: IReviewsRecord = action.payload.reviews;
        const reviewIds = reviews.map(review => review.id).toList();

        return currentState
          .set("reviewPage", action.payload.nextPage)
          .set("reviewIsEnd", action.payload.isEnd)
          .set("reviewIdsToShow", reviewIds)
          .set("isReviewLoading", false)
          .set("hasReviewError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_COMMENTS: {
      const targetStateKey = state.commentStates.findKey(
        commentState => commentState.reviewId === action.payload.reviewId,
      );

      if (targetStateKey === undefined) {
        const newCommentStates = state.commentStates.push({
          reviewId: action.payload.reviewId,
          isLoading: true,
          isEnd: false,
          page: 0,
          commentIdsToShow: [],
        });
        return state.set("commentStates", newCommentStates);
      } else {
        const targetState = state.commentStates.get(targetStateKey);
        const newState = {
          ...targetState,
          ...{
            isLoading: true,
          },
        };
        return state.setIn(["commentStates", targetStateKey], newState);
      }
    }

    case ACTION_TYPES.SUCCEEDED_TO_FETCH_COMMENTS: {
      const targetStateKey = state.commentStates.findKey(
        commentState => commentState.reviewId === action.payload.reviewId,
      );
      const targetState = state.commentStates.get(targetStateKey);
      const newCommentIds = action.payload.comments.map((comment: ICommentRecord) => comment.id).toArray();

      const newState = {
        ...targetState,
        ...{
          isLoading: false,
          page: action.payload.currentPage,
          commentIdsToShow: targetState.commentIdsToShow.concat(newCommentIds),
        },
      };

      return state.setIn(["commentStates", targetStateKey], newState);
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_REVIEWS: {
      const targetStateKey = state.commentStates.findKey(
        commentState => commentState.reviewId === action.payload.reviewId,
      );

      const targetState = state.commentStates.get(targetStateKey);

      const newState = {
        ...targetState,
        ...{
          isLoading: false,
        },
      };

      return state.setIn(["commentStates", targetStateKey], newState);
    }

    case ACTION_TYPES.ARTICLE_SHOW_OPEN_AUTHOR_LIST: {
      return state.set("isAuthorListOpen", true);
    }

    case ACTION_TYPES.ARTICLE_SHOW_CLOSE_AUTHOR_LIST: {
      return state.set("isAuthorListOpen", false);
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return ARTICLE_SHOW_INITIAL_STATE;
    }

    default:
      return state;
  }
}
