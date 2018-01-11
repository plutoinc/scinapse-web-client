jest.mock("../../../api/paper");
jest.mock("../../../helpers/handleGA");
jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { push } from "react-router-redux";

describe("articleSearch actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeSearchInput action", () => {
    it("should return ARTICLE_SEARCH_CHANGE_SEARCH_INPUT action with searchInput payload", () => {
      const mockSearchInput = "paper";
      store.dispatch(Actions.changeSearchInput(mockSearchInput));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
        payload: {
          searchInput: mockSearchInput,
        },
      });
    });
  });

  describe("handleSearchPush action", () => {
    describe("if searchInput.length < 2", () => {
      it("should call alert function", () => {
        const mockInValidSearchInput = "t";

        window.alert = jest.fn(() => {});
        store.dispatch(Actions.handleSearchPush(mockInValidSearchInput));
        expect(window.alert).toHaveBeenCalledWith("Search query length has to be over 2.");
      });
    });

    describe("if searchInput.length >= 2", () => {
      it("should return push to query", () => {
        const mockValidSearchInput = "tfsdfdsf";

        store.dispatch(Actions.handleSearchPush(mockValidSearchInput));

        const actions = store.getActions();
        expect(actions[0]).toEqual(
          push(`/search?query=${papersQueryFormatter.formatPapersQuery({ text: mockValidSearchInput })}&page=1`),
        );
      });
    });
  });
});
