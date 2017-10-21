import { List } from "immutable";
import { IEvaluationsRecord } from "../../model/evaluation";

const selectEvaluations = (evaluations: IEvaluationsRecord, evaluationsToShow: List<number>) => {
  return evaluations.filter(evaluation => {
    return evaluationsToShow.some(evaluationId => {
      return evaluationId === evaluation.id;
    });
  });
};

export default selectEvaluations;
