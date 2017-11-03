import { createSelector } from "reselect";
import { List } from "immutable";
import { IEvaluationsRecord } from "../../model/evaluation";

const getEvaluations = (evaluations: IEvaluationsRecord, evaluationsToShow: List<number>) => {
  if (evaluations && !evaluations.isEmpty()) {
    return evaluations.filter(evaluation => {
      return evaluationsToShow.some(evaluationId => {
        return evaluationId === evaluation.id;
      });
    });
  } else {
    return null;
  }
};

const selectEvaluations = createSelector([getEvaluations], getEvaluations => {
  if (getEvaluations && getEvaluations.count() > 0) {
    return getEvaluations.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      if (dateA === dateB) {
        return 0;
      }
    });
  } else {
    return List();
  }
});

export default selectEvaluations;
