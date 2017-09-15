jest.unmock("../records");

import {
  ArticleFeedStateFactory,
  IArticleFeedStateRecord,
  ARTICLE_FEED_INITIAL_STATE
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
        const jsState = {
          isLoading: false,
          hasError: false,
          isModalOpen: false
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
        expect(state.hasError).toBeTruthy();
      });

      it("should have param's isModalOpen value", () => {
        expect(state.isModalOpen).toBeFalsy;
      });
    });
  });
});
