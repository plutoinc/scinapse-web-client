jest.unmock("../reducer");
jest.unmock("../records");

import { List } from "immutable";
import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IArticleFeedStateRecord, ARTICLE_FEED_INITIAL_STATE, FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "../records";
import { RECORD } from "../../../__mocks__";

function reduceState(action: any, state: IArticleFeedStateRecord = ARTICLE_FEED_INITIAL_STATE) {
  return reducer(state, action);
}

describe("ArticleShow reducer", () => {
  let mockAction: any;
  let mockState: IArticleFeedStateRecord;
  let state: IArticleFeedStateRecord;

  describe("when receive ARTICLE_FEED_CHANGE_CATEGORY", () => {
    beforeEach(() => {
      mockState = ARTICLE_FEED_INITIAL_STATE.set("isCategoryPopOverOpen", true);
      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_CHANGE_CATEGORY,
        payload: {
          category: FEED_CATEGORIES.POST_PAPER,
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set category to payload's category value", () => {
      expect(state.category).toEqual(FEED_CATEGORIES.POST_PAPER);
    });

    it("should set isCategoryPopOverOpen to false", () => {
      expect(state.isCategoryPopOverOpen).toBeFalsy();
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

  describe("when receive ARTICLE_FEED_SUCCEEDED_TO_GET_ARTICLES", () => {
    const mockArticle = RECORD.ARTICLE.set("id", 1);
    const mockOriginalArticles = List([mockArticle]);
    const mockArticles = List([RECORD.ARTICLE]);

    beforeEach(() => {
      mockState = ARTICLE_FEED_INITIAL_STATE.withMutations(state => {
        state
          .set("feedItemsToShow", mockOriginalArticles)
          .set("isLoading", true)
          .set("hasError", true);
      });
      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_SUCCEEDED_TO_GET_ARTICLES,
        payload: {
          articles: mockArticles,
          nextPage: 1,
          isEnd: true,
        },
      };
    });

    it("should set isLoading to false", () => {
      state = reduceState(mockAction, mockState);
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      state = reduceState(mockAction, mockState);
      expect(state.hasError).toBeFalsy();
    });

    it("should set page to payload's nextPage value", () => {
      state = reduceState(mockAction, mockState);
      expect(state.page).toEqual(1);
    });

    it("should set isEnd to payload's isEnd value", () => {
      state = reduceState(mockAction, mockState);
      expect(state.isEnd).toBeTruthy();
    });

    it("should push payload's articles to feedItemsToShow", () => {
      state = reduceState(mockAction, mockState);
      expect(state.feedItemsToShow).toEqual(mockOriginalArticles.concat(mockArticles));
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
