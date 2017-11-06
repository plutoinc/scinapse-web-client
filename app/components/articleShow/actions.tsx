import { Dispatch } from "redux";
import axios, { CancelTokenSource } from "axios";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_EVALUATION_STEP } from "./records";
import ArticleAPI from "../../api/article";
import { IArticleRecord } from "../../model/article";
import handleErrorPage from "../../helpers/handleErrorPage";
import { IGetArticleEvaluationsParams, IGetCommentsParams, ISubmitEvaluationParams } from "../../api/article";

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

export function getEvaluations(params: IGetArticleEvaluationsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_EVALUATIONS,
    });

    try {
      const evaluationData = await ArticleAPI.getEvaluations(params);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_FETCH_EVALUATIONS,
        payload: {
          evaluations: evaluationData.evaluations,
          nextPage: evaluationData.number + 1,
          isEnd: evaluationData.last,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_EVALUATIONS,
      });

      alert(`Failed to get Evaluations! ${err}`);
    }
  };
}

export function getComments(params: IGetCommentsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_COMMENTS,
      payload: {
        evaluationId: params.evaluationId,
        currentPage: params.page,
      },
    });

    try {
      const commentsData = await ArticleAPI.getComments(params);
      dispatch({
        type: ACTION_TYPES.SUCCEEDED_TO_FETCH_COMMENTS,
        payload: {
          evaluationId: params.evaluationId,
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

export function changeEvaluationStep(step: ARTICLE_EVALUATION_STEP) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_STEP,
    payload: {
      step,
    },
  };
}

export function changeEvaluationScore(step: ARTICLE_EVALUATION_STEP, score: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_SCORE,
    payload: {
      step,
      score,
    },
  };
}

export function changeEvaluationComment(step: ARTICLE_EVALUATION_STEP, comment: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_COMMENT,
    payload: {
      step,
      comment,
    },
  };
}

export function submitEvaluation(params: ISubmitEvaluationParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION,
    });

    try {
      const newEvaluation = await ArticleAPI.postEvaluation(params);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION,
        payload: {
          articleId: params.articleId,
          evaluation: newEvaluation,
        },
      });

      dispatch(changeEvaluationStep(ARTICLE_EVALUATION_STEP.FINAL));

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
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION,
      });

      alert(`Failed to submit Evaluation! ${err}`);
    }
  };
}

export function togglePeerEvaluationComponent(peerEvaluationId: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT,
    payload: {
      peerEvaluationId,
    },
  };
}

export interface IHandlePeerEvaluationCommentSubmitParams {
  comment: string;
  articleId: number;
  evaluationId: number;
}

export function handlePeerEvaluationCommentSubmit(params: IHandlePeerEvaluationCommentSubmitParams) {
  return async (dispatch: Dispatch<any>) => {
    const { comment, articleId, evaluationId } = params;

    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT,
    });

    try {
      const recordifiedComment = await ArticleAPI.postComment({
        articleId,
        evaluationId,
        comment,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT,
        payload: {
          comment: recordifiedComment,
          evaluationId,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_PEER_EVALUATION_COMMENT_SUBMIT,
      });
      console.error(err);
    }
  };
}

export function votePeerEvaluation(articleId: number, evaluationId: number) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_EVALUATION,
      payload: {
        articleId,
        evaluationId,
      },
    });

    try {
      await ArticleAPI.voteEvaluation(articleId, evaluationId);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_VOTE_PEER_EVALUATION,
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_EVALUATION,
        payload: {
          articleId,
          evaluationId,
        },
      });

      alert(`Failed to vote peer Review! ${err}`);
    }
  };
}
