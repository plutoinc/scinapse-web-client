jest.unmock("../records");

import { List } from "immutable";
import { IArticleSearchState, SEARCH_SORTING, ISearchItemsInfo, initializeSearchItemsInfo } from "../records";
import { initialPaper, recordifyPaper, IPapersRecord, IPaperRecord } from "../../../model/paper";
import { ArticleSearchStateFactory, IArticleSearchStateRecord, ARTICLE_SEARCH_INITIAL_STATE } from "../records";

describe("articleSearch records", () => {
  describe("ArticleSearchStateFactory function", () => {
    let state: IArticleSearchStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = ArticleSearchStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(ARTICLE_SEARCH_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockIsLoading = false;
      const mockHasError = false;
      const mockSearchInput = "sdfjfs";
      const mockSearchItemsToShow: IPapersRecord = List([recordifyPaper(initialPaper)]);
      const mockSearchItemsInfo: ISearchItemsInfo = initializeSearchItemsInfo(3);
      const mockTargetPaper: IPaperRecord = recordifyPaper(initialPaper);
      const mockPage = 3223;
      const mockTotalElements = 3;
      const mockTotalPages = 2323;
      const mockIsEnd = false;
      const mockSorting = SEARCH_SORTING.RELEVANCE;

      beforeEach(() => {
        const jsState: IArticleSearchState = {
          isLoading: mockIsLoading,
          hasError: mockHasError,
          searchInput: mockSearchInput,
          searchItemsToShow: mockSearchItemsToShow,
          searchItemsInfo: mockSearchItemsInfo,
          targetPaper: mockTargetPaper,
          page: mockPage,
          totalElements: mockTotalElements,
          totalPages: mockTotalPages,
          isEnd: mockIsEnd,
          sorting: mockSorting,
        };

        state = ArticleSearchStateFactory(jsState);
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

      it("should have param's searchInput value", () => {
        expect(state.searchInput).toEqual(mockSearchInput);
      });

      it("should have param's searchItemsToShow value", () => {
        expect(state.searchItemsToShow).toEqual(mockSearchItemsToShow);
      });

      it("should have param's searchItemsInfo value", () => {
        expect(state.searchItemsInfo).toEqual(mockSearchItemsInfo);
      });

      it("should have param's targetPaper value", () => {
        expect(state.targetPaper).toEqual(mockTargetPaper);
      });

      it("should have param's page value", () => {
        expect(state.page).toEqual(mockPage);
      });

      it("should have param's totalElements value", () => {
        expect(state.totalElements).toEqual(mockTotalElements);
      });

      it("should have param's totalPages value", () => {
        expect(state.totalPages).toEqual(mockTotalPages);
      });

      it("should have param's isEnd value", () => {
        expect(state.isEnd).toEqual(mockIsEnd);
      });

      it("should have param's sorting value", () => {
        expect(state.sorting).toEqual(mockSorting);
      });
    });
  });
});
