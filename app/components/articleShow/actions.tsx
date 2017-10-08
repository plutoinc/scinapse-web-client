import { Dispatch } from "redux";
import { push } from "react-router-redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_EVALUATION_STEP } from "./records";
import ArticleAPI from "../../api/article";
import { IArticleRecord } from "../../model/article";
import { INotificationAction } from "../../helpers/notifier";

export function getArticle(articleId: number) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_ARTICLE,
    });

    try {
      const article: IArticleRecord = await ArticleAPI.getArticle(articleId);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_GET_ARTICLE,
        payload: {
          article,
        },
      });
    } catch (err) {
      const notificationAction: INotificationAction = {
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: "error",
          message: err,
        },
      };

      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_ARTICLE,
      });

      dispatch(notificationAction);

      dispatch(push("/"));
    }
  };
}

export function changeArticleEvaluationTab() {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_TAB,
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

interface ISubmitEvaluationParams {
  originalityScore: number;
  originalityComment: string;
  contributionScore: number;
  contributionComment: string;
  analysisScore: number;
  analysisComment: string;
  expressivenessScore: number;
  expressivenessComment: string;
}

export function submitEvaluation(params: ISubmitEvaluationParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION,
    });

    try {
      console.log(params);
      // TODO: Add submit API event
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION,
      });
      dispatch(changeEvaluationStep(ARTICLE_EVALUATION_STEP.FINAL));
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION,
      });
    }
  };
}

export function togglePeerEvaluationComponent(peerEvaluationId: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT,
    payload: {
      peerEvaluationId,
    },
  };
}

export interface IHandlePeerEvaluationCommentSubmitParams {
  comment: string;
  evaluationId: number;
}

export function handlePeerEvaluationCommentSubmit(params: IHandlePeerEvaluationCommentSubmitParams) {
  return async (dispatch: Dispatch<any>) => {
    const { comment, evaluationId } = params;

    dispatch({
      type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT,
    });

    try {
      // TODO: Add comment API
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT,
        payload: {
          comment,
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
