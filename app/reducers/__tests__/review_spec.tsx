jest.unmock("../review");

import { List } from "immutable";
import { reducer } from "../review";
import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { RECORD } from "../../__mocks__";
import { IReviewsRecord, REVIEWS_INITIAL_STATE } from "../../model/review";

function reduceState(action: IReduxAction<any>, state: IReviewsRecord = REVIEWS_INITIAL_STATE) {
  return reducer(state, action);
}

describe("Review Data Reducer", () => {
  let mockAction: any;
  let state: IReviewsRecord;
  let mockPayload: any;
  let mockState: IReviewsRecord;

  describe("when receive PROFILE_SUCCEEDED_TO_FETCH_USER_REVIEWS action", () => {
    const mockVote = 1000000;

    describe("when there are same id review in state", () => {
      beforeEach(() => {
        mockState = List([RECORD.REVIEW.set("vote", mockVote)]);

        const mockReview1 = RECORD.REVIEW.set("id", 1);
        const mockReview2 = RECORD.REVIEW.set("id", 2);

        mockPayload = {
          reviews: List([RECORD.REVIEW, mockReview1, mockReview2]),
        };

        mockAction = {
          type: ACTION_TYPES.SUCCEEDED_TO_FETCH_REVIEWS,
          payload: mockPayload,
        };

        state = reduceState(mockAction, mockState);
      });

      it("should have 3(updated one + added two) review in state", () => {
        expect(state.count()).toEqual(3);
      });

      it("should update already payload's reviews that already exist in state", () => {
        expect(state.get(0).vote).toEqual(2); // 2 means original vote
      });

      it("should concat payload's reviews that doesn't exist in state", () => {
        expect(state.get(2).id).toEqual(2);
      });
    });

    describe("when there isn't same id review in state", () => {
      const mockReview1 = RECORD.REVIEW.set("id", 1);
      const mockReview2 = RECORD.REVIEW.set("id", 2);
      const mockReviews = List([RECORD.REVIEW, mockReview1, mockReview2]);

      beforeEach(() => {
        mockState = List();

        mockPayload = {
          reviews: mockReviews,
        };

        mockAction = {
          type: ACTION_TYPES.SUCCEEDED_TO_FETCH_REVIEWS,
          payload: mockPayload,
        };

        state = reduceState(mockAction, mockState);
      });

      it("should concat payload's reviews to state", () => {
        expect(state).toEqual(mockReviews);
      });
    });
  });
});
