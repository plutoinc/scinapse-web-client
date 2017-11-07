import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { IReviewsRecord, EVALUATIONS_INITIAL_STATE, IReviewRecord } from "../model/review";

export function reducer(state = EVALUATIONS_INITIAL_STATE, action: IReduxAction<any>): IReviewsRecord {
  switch (action.type) {
    case ACTION_TYPES.SUCCEEDED_TO_FETCH_EVALUATIONS: {
      const targetEvaluations: IReviewsRecord = action.payload.evaluations;
      const updatedEvaluationsIdArray: number[] = [];

      const updatedEvaluationsList = state.map(review => {
        const alreadyExistEvaluation = targetEvaluations.find(targetEvaluation => {
          return targetEvaluation.id === review.id;
        });

        if (alreadyExistEvaluation !== undefined) {
          updatedEvaluationsIdArray.push(alreadyExistEvaluation.id);
          return alreadyExistEvaluation;
        } else {
          return review;
        }
      });

      const targetEvaluationsWithoutUpdatedEvaluations = targetEvaluations.filter(evaluation => {
        return !updatedEvaluationsIdArray.includes(evaluation.id);
      });

      return updatedEvaluationsList.concat(targetEvaluationsWithoutUpdatedEvaluations).toList();
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_EVALUATION: {
      const { evaluationId } = action.payload;

      const evaluationKey = state.findKey((evaluation: IReviewRecord) => {
        return evaluation.id === evaluationId;
      });

      const currentVoteCount = state.getIn([evaluationKey, "vote"]);

      return state.withMutations(currentState => {
        currentState.setIn([evaluationKey, "voted"], true).setIn([evaluationKey, "vote"], currentVoteCount + 1);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_EVALUATION: {
      const { evaluationId } = action.payload;

      const evaluationKey = state.findKey((evaluation: IReviewRecord) => {
        return evaluation.id === evaluationId;
      });
      const currentVoteCount = state.getIn([evaluationKey, "vote"]);

      return state.withMutations(currentState => {
        currentState.setIn([evaluationKey, "voted"], false).setIn([evaluationKey, "vote"], currentVoteCount - 1);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION: {
      const { evaluation } = action.payload;
      return state.push(evaluation);
    }

    default:
      return state;
  }
}
