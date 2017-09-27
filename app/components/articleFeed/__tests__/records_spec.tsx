jest.unmock("../records");

import {
  ArticleFeedStateFactory,
  IArticleFeedStateRecord,
  IArticleFeedState,
  ARTICLE_FEED_INITIAL_STATE,
  FEED_SORTING_OPTIONS,
  FEED_CATEGORIES,
} from "../records";

describe("ArticleFeed records", () => {
  describe("ArticleFeedStateFactory function", () => {
    let state: IArticleFeedStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = ArticleFeedStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(ARTICLE_FEED_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      beforeEach(() => {
        const jsState: IArticleFeedState = {
          isLoading: false,
          hasError: false,
          sortingOption: FEED_SORTING_OPTIONS.SCORE,
          isCategoryPopOverOpen: false,
          category: FEED_CATEGORIES.ALL,
          categoryPopoverAnchorElement: null,
        };

        state = ArticleFeedStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeFalsy();
      });

      it("should have param's sortingOption value", () => {
        expect(state.sortingOption).toEqual(FEED_SORTING_OPTIONS.SCORE);
      });

      it("should have param's isCategoryPopOverOpen value", () => {
        expect(state.isCategoryPopOverOpen).toBeFalsy();
      });

      it("should have param's categoryPopoverAnchorElement value", () => {
        expect(state.categoryPopoverAnchorElement).toBeNull();
      });

      it("should have param's category value", () => {
        expect(state.category).toEqual(FEED_CATEGORIES.ALL);
      });
    });
  });
});
