jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IArticleFeedStateRecord, ARTICLE_FEED_INITIAL_STATE, FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "../records";

function reduceState(action: any, state: IArticleFeedStateRecord = ARTICLE_FEED_INITIAL_STATE) {
  return reducer(state, action);
}

describe("ArticleShow reducer", () => {
  let mockAction: any;
  let mockState: IArticleFeedStateRecord;
  let state: IArticleFeedStateRecord;

  describe("when receive ARTICLE_FEED_CHANGE_CATEGORY", () => {
    it("should set category to payload's category value", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_CHANGE_CATEGORY,
        payload: {
          category: FEED_CATEGORIES.POST_PAPER,
        },
      };

      state = reduceState(mockAction);
      expect(state.category).toEqual(FEED_CATEGORIES.POST_PAPER);
    });
  });

  describe("when receive ARTICLE_FEED_CHANGE_SORTING_OPTION", () => {
    it("should set sortingOption to payload's sortingOption value", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_CHANGE_SORTING_OPTION,
        payload: {
          sortingOption: FEED_SORTING_OPTIONS.LATEST,
        },
      };

      state = reduceState(mockAction);
      expect(state.sortingOption).toEqual(FEED_SORTING_OPTIONS.LATEST);
    });
  });

  describe("when receive ARTICLE_FEED_OPEN_CATEGORY_POPOVER", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_OPEN_CATEGORY_POPOVER,
        payload: {
          element: document.body,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isCategoryPopOverOpen to true", () => {
      expect(state.isCategoryPopOverOpen).toBeTruthy();
    });

    it("should set categoryPopoverAnchorElement to payload's element", () => {
      expect(state.categoryPopoverAnchorElement).toEqual(document.body);
    });
  });

  describe("when receive ARTICLE_FEED_CLOSE_CATEGORY_POPOVER", () => {
    it("should set isCategoryPopOverOpen to false", () => {
      mockState = ARTICLE_FEED_INITIAL_STATE.set("isCategoryPopOverOpen", true);
      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_CLOSE_CATEGORY_POPOVER,
      };

      state = reduceState(mockAction, mockState);
      expect(state.isCategoryPopOverOpen).toBeFalsy();
    });
  });

  describe("when receive GLOBAL_LOCATION_CHANGE", () => {
    it("should return initial state", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE,
      };

      state = reduceState(mockAction);
      expect(state).toEqual(ARTICLE_FEED_INITIAL_STATE);
    });
  });
});
