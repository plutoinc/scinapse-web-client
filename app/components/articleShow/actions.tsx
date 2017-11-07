import { Dispatch } from "redux";
import axios, { CancelTokenSource } from "axios";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_REVIEW_STEP } from "./records";
import ArticleAPI from "../../api/article";
import { IArticleRecord } from "../../model/article";
import handleErrorPage from "../../helpers/handleErrorPage";
import {
  IGetArticleReviewsParams,
  IGetCommentsParams,
  ISubmitReviewParams,
  IPostCommentParams,
} from "../../api/article";

export function openAuthorList() {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_OPEN_AUTHOR_LIST,
  };
}

export function closeAuthorList() {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CLOSE_AUTHOR_LIST,
  };
}

export function getArticle(articleId: number, cancelTokenSource: CancelTokenSource) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_ARTICLE,
    });

    try {
      const article: IArticleRecord = await ArticleAPI.getArticle(articleId, cancelTokenSource);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE,
        payload: {
          article,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch({
          type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_ARTICLE,
        });

        alert(`Failed to get Article! ${err}`);
        handleErrorPage(err.status || 404);
      }
    }
  };
}

export function getReviews(params: IGetArticleReviewsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_REVIEWS,
    });

    try {
      const reviewData = await ArticleAPI.getReviews(params);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_FETCH_REVIEWS,
        payload: {
          reviews: reviewData.reviews,
          nextPage: reviewData.number + 1,
          isEnd: reviewData.last,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_REVIEWS,
      });

      alert(`Failed to get Reviews! ${err}`);
    }
  };
}

export function getComments(params: IGetCommentsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_COMMENTS,
      payload: {
        reviewId: params.reviewId,
        currentPage: params.page,
      },
    });

    try {
      const commentsData = await ArticleAPI.getComments(params);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_FETCH_COMMENTS,
        payload: {
          reviewId: params.reviewId,
          comments: commentsData.comments,
          nextPage: commentsData.number + 1,
          isEnd: commentsData.last,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_COMMENTS,
      });

      alert(`Failed to get Comments! ${err}`);
    }
  };
}

export function changeReviewStep(step: ARTICLE_REVIEW_STEP) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_STEP,
    payload: {
      step,
    },
  };
}

export function changeReviewScore(step: ARTICLE_REVIEW_STEP, score: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_SCORE,
    payload: {
      step,
      score,
    },
  };
}

export function changeReviewInput(review: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_REVIEW_INPUT,
    payload: {
      review,
    },
  };
}

export function submitReview(params: ISubmitReviewParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_REVIEW,
    });

    try {
      const newReview = await ArticleAPI.postReview(params);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_REVIEW,
        payload: {
          articleId: params.articleId,
          review: newReview,
        },
      });

      dispatch(changeReviewStep(ARTICLE_REVIEW_STEP.FINAL));

      const updatedArticlePoint = await ArticleAPI.getArticlePoint(params.articleId, params.cancelTokenSource);
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_UPDATE_ARTICLE_POINT,
        payload: {
          articleId: params.articleId,
          point: updatedArticlePoint,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_REVIEW,
      });

      alert(`Failed to submit Review! ${err}`);
    }
  };
}

export function togglePeerReviewComponent(peerReviewId: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT,
    payload: {
      peerReviewId,
    },
  };
}

export function handlePeerReviewCommentSubmit(params: IPostCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    const { comment, articleId, reviewId } = params;

    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_REVIEW_COMMENT_SUBMIT,
    });

    try {
      const recordifiedComment = await ArticleAPI.postComment({
        articleId,
        reviewId,
        comment,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_REVIEW_COMMENT_SUBMIT,
        payload: {
          comment: recordifiedComment,
          reviewId,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_PEER_REVIEW_COMMENT_SUBMIT,
      });
      console.error(err);
    }
  };
}

export function votePeerReview(articleId: number, reviewId: number) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_REVIEW,
      payload: {
        articleId,
        reviewId,
      },
    });

    try {
      await ArticleAPI.voteReview(articleId, reviewId);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_VOTE_PEER_REVIEW,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_REVIEW,
        payload: {
          articleId,
          reviewId,
        },
      });

      alert(`Failed to vote peer Review! ${err}`);
    }
  };
}
