import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_EVALUATION_STEP } from "./records";
import { Dispatch } from "redux";

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
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION,
      });
    }
  };
}
