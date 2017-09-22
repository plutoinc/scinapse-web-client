jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";

describe("ArticleShow state actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("openPeerEvaluationComponent action", () => {
    it("should return ARTICLE_SHOW_OPEN_PEER_EVALUATION_COMPONENT action", () => {
      store.dispatch(Actions.openPeerEvaluationComponent());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_OPEN_PEER_EVALUATION_COMPONENT,
      });
    });
  });

  describe("closePeerEvaluationComponent action", () => {
    it("should return ARTICLE_SHOW_CLOSE_PEER_EVALUATION_COMPONENT action", () => {
      store.dispatch(Actions.closePeerEvaluationComponent());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SHOW_CLOSE_PEER_EVALUATION_COMPONENT,
      });
    });
  });
});
