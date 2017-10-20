import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { IEvaluationsRecord, EVALUATIONS_INITIAL_STATE } from "../model/evaluation";

export function reducer(state = EVALUATIONS_INITIAL_STATE, action: IReduxAction<any>): IEvaluationsRecord {
  switch (action.type) {
    case ACTION_TYPES.PROFILE_SUCCEEDED_TO_FETCH_USER_EVALUATIONS: {
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

    case ACTION_TYPES.PROFILE_CLEAR_EVALUATIONS_TO_SHOW: {
      return state;
    }

    default:
      return state;
  }
}
