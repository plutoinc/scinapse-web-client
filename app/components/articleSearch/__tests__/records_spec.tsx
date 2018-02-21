jest.unmock("../records");

import {
  ArticleSearchStateFactory,
  ArticleSearchStateRecord,
  ARTICLE_SEARCH_INITIAL_STATE,
  ArticleSearchState,
  SEARCH_SORTING,
  initialSearchItemMeta,
  SearchItemMeta,
} from "../records";
import { initialPaper, Paper } from "../../../model/paper";

describe("articleSearch records", () => {
  describe("ArticleSearchStateFactory function", () => {
    let state: ArticleSearchStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = ArticleSearchStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state.toJS()).toEqual(ARTICLE_SEARCH_INITIAL_STATE.toJS());
      });
    });

    describe("when there is normal js params", () => {
      const mockIsLoading = false;
      const mockHasError = false;
      const mockSearchInput = "sdfjfs";
      const mockSearchItemsToShow: Paper[] = [initialPaper];
      const mocksearchItemsMeta: SearchItemMeta[] = [
        initialSearchItemMeta,
        initialSearchItemMeta,
        initialSearchItemMeta,
      ];
      const mockTargetPaper: Paper = initialPaper;
      const mockPage = 3223;
      const mockTotalElements = 3;
      const mockTotalPages = 2323;
      const mockIsEnd = false;
      const mockSorting = SEARCH_SORTING.RELEVANCE;

      beforeEach(() => {
        const jsState: ArticleSearchState = {
          isLoading: mockIsLoading,
          hasError: mockHasError,
          searchInput: mockSearchInput,
          searchItemsToShow: mockSearchItemsToShow,
          searchItemsMeta: mocksearchItemsMeta,
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

      describe("when recordify multi depth attributes", () => {
        describe("when recordify searchItemsToShow", () => {
          it("should have param's searchItemsToShow value", () => {
            expect(state.searchItemsToShow.toString().slice(0, 30)).toContain("List");
            expect(state.searchItemsToShow.toString().slice(0, 30)).toContain("Record");
          });

          it("should have param's searchItemsToShow value", () => {
            expect(state.searchItemsToShow.toJS()).toEqual(mockSearchItemsToShow);
          });
        });

        describe("when recordify targetPaper", () => {
          it("should have param's targetPaper value", () => {
            expect(state.targetPaper.toString().slice(0, 6)).toContain("Record");
          });

          it("should have param's targetPaper value", () => {
            expect(state.targetPaper.toJS()).toEqual(mockTargetPaper);
          });
        });

        describe("when recordify searchItemsMeta", () => {
          it("should have param's searchItemsMeta value", () => {
            expect(state.searchItemsMeta.toString().slice(0, 30)).toContain("List");
            expect(state.searchItemsMeta.toString().slice(0, 30)).toContain("Record");
          });

          it("should have param's searchItemsMeta value", () => {
            expect(state.searchItemsMeta.toJS()).toEqual(mocksearchItemsMeta);
          });
        });
      });
    });
  });
});
