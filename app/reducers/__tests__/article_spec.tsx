jest.unmock("../article");

import { reducer } from "../article";
import { ARTICLE_INITIAL_STATE, IArticlesRecord } from "../../model/article";
import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { RECORD } from "../../__mocks__";

function reduceState(action: IReduxAction<any>, state: IArticlesRecord = ARTICLE_INITIAL_STATE) {
  return reducer(state, action);
}

describe("Article reducer", () => {
  let mockAction: any;
  let state: IArticlesRecord;

  describe("when receive ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION action", () => {
    describe("when actions doesn't have payload", () => {
      it("should return state itself", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION,
        };

        state = reduceState(mockAction);

        expect(state).toEqual(ARTICLE_INITIAL_STATE);
      });
    });

    describe("when actions doesn't have articleId or evaluation in payload", () => {
      it("should return state itself", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION,
          payload: {
            articleId: 1,
          },
        };

        state = reduceState(mockAction);

        expect(state).toEqual(ARTICLE_INITIAL_STATE);
      });
    });

    describe("when actions has both articleId and valid evaluation in payload", () => {
      describe("when target article doesn't exist in the state", () => {
        it("should return state itself", () => {
          mockAction = {
            type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION,
            payload: {
              articleId: 1,
              evaluation: RECORD.EVALUATION,
            },
          };

          state = reduceState(mockAction);

          expect(state).toEqual(ARTICLE_INITIAL_STATE);
        });
      });
    });
  });
});
