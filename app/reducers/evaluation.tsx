import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { IEvaluationsRecord, EVALUATIONS_INITIAL_STATE, IEvaluationRecord } from "../model/evaluation";

export function reducer(state = EVALUATIONS_INITIAL_STATE, action: IReduxAction<any>): IEvaluationsRecord {
  switch (action.type) {
    case ACTION_TYPES.SUCCEEDED_TO_FETCH_EVALUATIONS: {
      const targetEvaluations: IEvaluationsRecord = action.payload.evaluations;
      const updatedEvaluationsIdArray: number[] = [];

      const updatedEvaluationsList = state.map(evaluation => {
        const alreadyExistEvaluation = targetEvaluations.find(targetEvaluation => {
          return targetEvaluation.id === evaluation.id;
        });

        if (alreadyExistEvaluation !== undefined) {
          updatedEvaluationsIdArray.push(alreadyExistEvaluation.id);
          return alreadyExistEvaluation;
        } else {
          return evaluation;
        }
      });

      const targetEvaluationsWithoutUpdatedEvaluations = targetEvaluations.filter(evaluation => {
        return !updatedEvaluationsIdArray.includes(evaluation.id);
      });

      return updatedEvaluationsList.concat(targetEvaluationsWithoutUpdatedEvaluations).toList();
    }

    case ACTION_TYPES.ARTICLE_SHOW_START_TO_VOTE_PEER_EVALUATION: {
      const { evaluationId } = action.payload;

      const evaluationKey = state.findKey((evaluation: IEvaluationRecord) => {
        return evaluation.id === evaluationId;
      });

      const currentVoteCount = state.getIn([evaluationKey, "vote"]);

      return state.withMutations(currentState => {
        currentState.setIn([evaluationKey, "voted"], true).setIn([evaluationKey, "vote"], currentVoteCount + 1);
      });
    }

    case ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_VOTE_PEER_EVALUATION: {
      const { evaluationId } = action.payload;

      const evaluationKey = state.findKey((evaluation: IEvaluationRecord) => {
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
