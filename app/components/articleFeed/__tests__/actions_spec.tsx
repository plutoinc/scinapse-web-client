jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "../records";

describe("article feed actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeCategory action", () => {
    it("should return ARTICLE_FEED_CHANGE_CATEGORY action with category payload", () => {
      store.dispatch(Actions.changeCategory(FEED_CATEGORIES.POST_PAPER));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_FEED_CHANGE_CATEGORY,
        payload: {
          category: FEED_CATEGORIES.POST_PAPER,
        },
      });
    });
  });

  describe("changeSortingOption action", () => {
    it("should return ARTICLE_FEED_CHANGE_SORTING_OPTION action with sorting option payload", () => {
      store.dispatch(Actions.changeSortingOption(FEED_SORTING_OPTIONS.LATEST));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_FEED_CHANGE_SORTING_OPTION,
        payload: {
          sortingOption: FEED_SORTING_OPTIONS.LATEST,
        },
      });
    });
  });

  describe("openCategoryPopover action", () => {
    it("should return ARTICLE_FEED_OPEN_CATEGORY_POPOVER action", () => {
      store.dispatch(Actions.openCategoryPopover(document.body));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_FEED_OPEN_CATEGORY_POPOVER,
        payload: {
          element: document.body,
        },
      });
    });
  });

  describe("closeCategoryPopover action", () => {
    it("should return ARTICLE_FEED_CLOSE_CATEGORY_POPOVER action", () => {
      store.dispatch(Actions.closeCategoryPopover());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_FEED_CLOSE_CATEGORY_POPOVER,
      });
    });
  });
});
