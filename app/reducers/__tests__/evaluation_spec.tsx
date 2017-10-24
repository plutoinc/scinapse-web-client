jest.unmock("../evaluation");

import { List } from "immutable";
import { reducer } from "../evaluation";
import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { RECORD } from "../../__mocks__";
import { IEvaluationsRecord, EVALUATIONS_INITIAL_STATE } from "../../model/evaluation";

function reduceState(action: IReduxAction<any>, state: IEvaluationsRecord = EVALUATIONS_INITIAL_STATE) {
  return reducer(state, action);
}

describe("Evaluation Data Reducer", () => {
  let mockAction: any;
  let state: IEvaluationsRecord;
  let mockPayload: any;
  let mockState: IEvaluationsRecord;

  describe("when receive PROFILE_SUCCEEDED_TO_FETCH_USER_EVALUATIONS action", () => {
    const mockVote = 1000000;

    describe("when there are same id evaluation in state", () => {
      beforeEach(() => {
        mockState = List([RECORD.EVALUATION.set("vote", mockVote)]);

        const mockEvaluation1 = RECORD.EVALUATION.set("id", 1);
        const mockEvaluation2 = RECORD.EVALUATION.set("id", 2);

        mockPayload = {
          evaluations: List([RECORD.EVALUATION, mockEvaluation1, mockEvaluation2]),
        };

        mockAction = {
          type: ACTION_TYPES.SUCCEEDED_TO_FETCH_EVALUATIONS,
          payload: mockPayload,
        };

        state = reduceState(mockAction, mockState);
      });

      it("should have 3(updated one + added two) evaluation in state", () => {
        expect(state.count()).toEqual(3);
      });

      it("should update already payload's evaluations that already exist in state", () => {
        expect(state.get(0).vote).toEqual(2); // 2 means original vote
      });

      it("should concat payload's evaluations that doesn't exist in state", () => {
        expect(state.get(2).id).toEqual(2);
      });
    });

    describe("when there isn't same id evaluation in state", () => {
      const mockEvaluation1 = RECORD.EVALUATION.set("id", 1);
      const mockEvaluation2 = RECORD.EVALUATION.set("id", 2);
      const mockEvaluations = List([RECORD.EVALUATION, mockEvaluation1, mockEvaluation2]);

      beforeEach(() => {
        mockState = List();

        mockPayload = {
          evaluations: mockEvaluations,
        };

        mockAction = {
          type: ACTION_TYPES.SUCCEEDED_TO_FETCH_EVALUATIONS,
          payload: mockPayload,
        };

        state = reduceState(mockAction, mockState);
      });

      it("should concat payload's evaluations to state", () => {
        expect(state).toEqual(mockEvaluations);
      });
    });
  });
});
