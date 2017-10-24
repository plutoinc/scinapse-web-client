import { IReduxAction } from "../../typings/actionType";
import {
  ARTICLE_SHOW_INITIAL_STATE,
  IArticleShowStateRecord,
  ARTICLE_EVALUATION_TAB,
  ARTICLE_EVALUATION_STEP,
} from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { IEvaluationsRecord } from "../../model/evaluation";

export function reducer(state = ARTICLE_SHOW_INITIAL_STATE, action: IReduxAction<any>): IArticleShowStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_TAB: {
      if (state.evaluationTab === ARTICLE_EVALUATION_TAB.MY) {
        return state.set("evaluationTab", ARTICLE_EVALUATION_TAB.PEER);
      } else {
        return state.set("evaluationTab", ARTICLE_EVALUATION_TAB.MY);
      }
    }

    case ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT: {
      let peerEvaluationId: string = null;
      if (state.peerEvaluationId !== action.payload.peerEvaluationId) {
        peerEvaluationId = action.payload.peerEvaluationId;
      }
      return state.set("peerEvaluationId", peerEvaluationId);
    }

    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_STEP: {
      return state.set("currentStep", action.payload.step);
    }

    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_SCORE: {
      switch (action.payload.step) {
        case ARTICLE_EVALUATION_STEP.FIRST: {
          return state.set("myOriginalityScore", action.payload.score);
        }

        case ARTICLE_EVALUATION_STEP.SECOND: {
          return state.set("mySignificanceScore", action.payload.score);
        }
        case ARTICLE_EVALUATION_STEP.THIRD: {
          return state.set("myValidityScore", action.payload.score);
        }
        case ARTICLE_EVALUATION_STEP.FOURTH: {
          return state.set("myOrganizationScore", action.payload.score);
        }

        default:
          break;
      }
    }

    case ACTION_TYPES.ARTICLE_SHOW_CHANGE_EVALUATION_COMMENT: {
      switch (action.payload.step) {
        case ARTICLE_EVALUATION_STEP.FIRST: {
          return state.set("myOriginalityComment", action.payload.comment);
        }

        case ARTICLE_EVALUATION_STEP.SECOND: {
          return state.set("mySignificanceComment", action.payload.comment);
        }
        case ARTICLE_EVALUATION_STEP.THIRD: {
          return state.set("myValidityComment", action.payload.comment);
        }
        case ARTICLE_EVALUATION_STEP.FOURTH: {
          return state.set("myOrganizationComment", action.payload.comment);
        }

        default:
          break;
      }
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION: {
      return state.withMutations(currentState => {
        return currentState.set("isEvaluationSubmitLoading", true).set("hasEvaluationSubmitError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION: {
      return state.withMutations(currentState => {
        return currentState.set("isEvaluationSubmitLoading", false).set("hasEvaluationSubmitError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION: {
      return state.withMutations(currentState => {
        return currentState.set("isEvaluationSubmitLoading", false).set("hasEvaluationSubmitError", false);
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

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT: {
      return state.withMutations(currentState => {
        return currentState.set("evaluationCommentHasError", false).set("evaluationCommentIsLoading", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT: {
      return state.withMutations(currentState => {
        return currentState.set("evaluationCommentHasError", false).set("evaluationCommentIsLoading", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_PEER_EVALUATION_COMMENT_SUBMIT: {
      return state.withMutations(currentState => {
        return currentState.set("evaluationCommentHasError", true).set("evaluationCommentIsLoading", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_GET_EVALUATIONS: {
      return state.withMutations(currentState => {
        return currentState.set("isEvaluationLoading", true).set("hasEvaluationError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_GET_EVALUATIONS: {
      return state.withMutations(currentState => {
        return currentState.set("isEvaluationLoading", false).set("hasEvaluationError", true);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_FETCH_EVALUATIONS: {
      return state.withMutations(currentState => {
        const evaluations: IEvaluationsRecord = action.payload.evaluations;
        const evaluationIds = evaluations.map(evaluation => evaluation.id).toList();

        return currentState
          .set("evaluationPage", action.payload.nextPage)
          .set("evaluationIsEnd", action.payload.isEnd)
          .set("evaluationIdsToShow", evaluationIds)
          .set("isEvaluationLoading", false)
          .set("hasEvaluationError", false);
      });
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return ARTICLE_SHOW_INITIAL_STATE;
    }

    default:
      return state;
  }
}
