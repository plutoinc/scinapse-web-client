jest.mock("../../../helpers/makePlutoToastAction", () => {
  return () => {};
});
jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";

describe("ArticleShow state actions", () => {
  let store: any;
  let mockPeerEvaluationId: number = 123;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("togglePeerEvaluationComponent action", () => {
    it("should return ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT action", () => {
      store.dispatch(Actions.togglePeerEvaluationComponent(mockPeerEvaluationId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT,
        payload: {
          peerEvaluationId: mockPeerEvaluationId,
        },
      });
    });
  });
});
