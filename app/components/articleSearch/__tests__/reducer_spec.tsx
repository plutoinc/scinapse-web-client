jest.unmock("../reducer");
jest.unmock("../records");
jest.unmock("../../paperShow/records");

import { List } from "immutable";
import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import {
  ArticleSearchStateRecord,
  ARTICLE_SEARCH_INITIAL_STATE,
  SearchItemMetaFactory,
  makeSearchItemMetaListFromPaperList,
  initialSearchItemMeta,
} from "../records";
import { initialPaper, PaperFactory, PaperRecord, PaperList } from "../../../model/paper";
import { initialComment, IComment, ICommentRecord, recordifyComment } from "../../../model/comment";
import { RECORD } from "../../../__mocks__";
import {
  FILTER_RANGE_TYPE,
  FILTER_BOX_TYPE,
  FILTER_TYPE_HAS_RANGE,
  FILTER_TYPE_HAS_EXPANDING_OPTION,
} from "../actions";
import { AvailableCitationType } from "../../paperShow/records";

function reduceState(action: any, state: ArticleSearchStateRecord = ARTICLE_SEARCH_INITIAL_STATE) {
  return reducer(state, action);
}

describe("articleSearch reducer", () => {
  let mockPapers: PaperList;
  let mockAction: any;
  let state: ArticleSearchStateRecord;

  beforeEach(() => {
    mockPapers = List(RECORD.PAPER);
  });

  describe("when receive ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG,
      };

      state = reduceState(mockAction);
    });

    it("should change isCitationDialogOpen state to opposite value of the current isCitationDialogOpen state", () => {
      expect(state.isCitationDialogOpen).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT,
      };

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("citationText", "mockText");

      state = reduceState(mockAction, mockState);
    });

    it("should change isFetchingCitationInformation state to true", () => {
      expect(state.isFetchingCitationInformation).toBeTruthy();
    });

    it("should change citationText state to empty string", () => {
      expect(state.citationText).toEqual("");
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT action", () => {
    const mockCitationText = "mockText";

    beforeEach(() => {
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("isFetchingCitationInformation", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT,
        payload: {
          citationText: mockCitationText,
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should change isFetchingCitationInformation state to false", () => {
      expect(state.isFetchingCitationInformation).toBeFalsy();
    });

    it("should change citationText state to payload's citationText value", () => {
      expect(state.citationText).toEqual(mockCitationText);
    });
  });

  describe("when receive ARTICLE_SEARCH_CLICK_CITATION_TAB action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CLICK_CITATION_TAB,
        payload: {
          tab: AvailableCitationType.APA,
        },
      };

      state = reduceState(mockAction);
    });

    it("should change activeCitationTab state to the payload's tab state", () => {
      expect(state.activeCitationTab).toEqual(AvailableCitationType.APA);
    });
  });

  describe("when receive ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX", () => {
    describe("when payload's type is FOS", () => {
      it("should change isFOSFilterExpanding state to opposite value of current state", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
          payload: {
            type: FILTER_TYPE_HAS_EXPANDING_OPTION.FOS,
          },
        };

        state = reduceState(mockAction);

        expect(state.isFOSFilterExpanding).toBeTruthy();
      });
    });

    describe("when payload's type is JOURNAL", () => {
      it("should change isJournalFilterExpanding state to opposite value of current state", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
          payload: {
            type: FILTER_TYPE_HAS_EXPANDING_OPTION.JOURNAL,
          },
        };

        state = reduceState(mockAction);

        expect(state.isJournalFilterExpanding).toBeTruthy();
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_TOGGLE_FILTER_BOX", () => {
    describe("when payload's type is PUBLISHED_YEAR", () => {
      it("should change isYearFilterOpen state to opposite value of current state", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
          payload: {
            type: FILTER_BOX_TYPE.PUBLISHED_YEAR,
          },
        };

        state = reduceState(mockAction);

        expect(state.isYearFilterOpen).toBeFalsy();
      });
    });

    describe("when payload's type is JOURNAL_IF", () => {
      it("should change isJournalIFFilterOpen state to opposite value of current state", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
          payload: {
            type: FILTER_BOX_TYPE.JOURNAL_IF,
          },
        };

        state = reduceState(mockAction);

        expect(state.isJournalIFFilterOpen).toBeFalsy();
      });
    });

    describe("when payload's type is FOS", () => {
      it("should change isFOSFilterOpen state to opposite value of current state", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
          payload: {
            type: FILTER_BOX_TYPE.FOS,
          },
        };

        state = reduceState(mockAction);

        expect(state.isFOSFilterOpen).toBeFalsy();
      });
    });

    describe("when payload's type is JOURNAL", () => {
      it("should change isJournalFilterOpen state to opposite value of current state", () => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
          payload: {
            type: FILTER_BOX_TYPE.JOURNAL,
          },
        };

        state = reduceState(mockAction);

        expect(state.isJournalFilterOpen).toBeFalsy();
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT", () => {
    describe("when payload's type is JOURNAL_IF", () => {
      describe("when payload's rangeType is FROM", () => {
        it("should change IFFilterFromValue state following with payload's numberValue", () => {
          const mockIF = 10;

          mockAction = {
            type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
            payload: {
              type: FILTER_TYPE_HAS_RANGE.JOURNAL_IF,
              rangeType: FILTER_RANGE_TYPE.FROM,
              numberValue: mockIF,
            },
          };

          state = reduceState(mockAction);

          expect(state.IFFilterFromValue).toEqual(mockIF);
        });
      });

      describe("when payload's rangeType is TO", () => {
        it("should change IFFilterToValue state following with payload's numberValue", () => {
          const mockIF = 20;

          mockAction = {
            type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
            payload: {
              type: FILTER_TYPE_HAS_RANGE.JOURNAL_IF,
              rangeType: FILTER_RANGE_TYPE.TO,
              numberValue: mockIF,
            },
          };

          state = reduceState(mockAction);

          expect(state.IFFilterToValue).toEqual(mockIF);
        });
      });
    });

    describe("when payload's type is PUBLISHED_YEAR", () => {
      describe("when payload's rangeType is FROM", () => {
        it("should change yearFilterFromValue state following with payload's numberValue", () => {
          const mockYear = 2000;

          mockAction = {
            type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
            payload: {
              type: FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
              rangeType: FILTER_RANGE_TYPE.FROM,
              numberValue: mockYear,
            },
          };

          state = reduceState(mockAction);

          expect(state.yearFilterFromValue).toEqual(mockYear);
        });
      });

      describe("when payload's rangeType is TO", () => {
        it("should change yearFilterToValue state following with payload's numberValue", () => {
          const mockYear = 2000;

          mockAction = {
            type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
            payload: {
              type: FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
              rangeType: FILTER_RANGE_TYPE.TO,
              numberValue: mockYear,
            },
          };

          state = reduceState(mockAction);

          expect(state.yearFilterToValue).toEqual(mockYear);
        });
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_CHANGE_SEARCH_INPUT", () => {
    it("should set searchInput following searchInput payload", () => {
      const mockSearchInput = "paper";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
        payload: {
          searchInput: mockSearchInput,
        },
      };

      state = reduceState(mockAction);

      expect(state.searchInput).toEqual(mockSearchInput);
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS", () => {
    const mockPage = 3;
    const mockIsEnd = false;
    const mockTotalElements = 3;
    const mockTotalPages = 23;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: mockPapers,
          nextPage: mockPage + 1,
          isEnd: mockIsEnd,
          totalElements: mockTotalElements,
          totalPages: mockTotalPages,
          numberOfElements: mockPapers,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isEnd following isEnd payload", () => {
      expect(state.isEnd).toEqual(mockIsEnd);
    });

    it("should set page following nextPage payload", () => {
      expect(state.page).toEqual(mockPage + 1);
    });

    it("should set searchItemsToShow following papers payload", () => {
      expect(state.searchItemsToShow).toEqual(mockPapers);
    });

    it("should set searchItemsMeta following recordifed initializesearchItemsMeta with numberOfElements payload value", () => {
      expect(JSON.stringify(state.searchItemsMeta)).toEqual(
        JSON.stringify(makeSearchItemMetaListFromPaperList(mockPapers)),
      );
    });

    it("should set totalElements following totalElements payload", () => {
      expect(state.totalElements).toEqual(mockTotalElements);
    });

    it("should set totalPages following totalPages payload", () => {
      expect(state.totalPages).toEqual(mockTotalPages);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });

    it("should set targetPaper to null", () => {
      expect(state.targetPaper).toBeNull();
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_GET_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT", () => {
    it("should remove following paper's comment", () => {
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockPaperId,
      };
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockPaperId,
        comments: [mockComment],
      });

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsToShow", List([mockPaper]));

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT,
        payload: {
          paperId: mockPaperId,
          commentId: mockCommentId,
        },
      };

      state = reduceState(mockAction, mockState);

      const paperKey = state.searchItemsToShow.findKey((paper: PaperRecord) => {
        return paper.id === mockPaperId;
      });

      const commentKey = state.searchItemsToShow.getIn([paperKey, "comments"]).findKey((comment: ICommentRecord) => {
        return comment.id === mockCommentId;
      });
      expect(state.getIn(["searchItemsToShow", mockPaperId, "comments", commentKey])).toBeUndefined();
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS", () => {
    const mockPage = 3;
    const mockIsEnd = false;
    const mockTotalElements = 3;
    const mockTotalPages = 23;
    const mockTargetPaper = initialPaper;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
        payload: {
          papers: mockPapers,
          nextPage: mockPage + 1,
          isEnd: mockIsEnd,
          totalElements: mockTotalElements,
          totalPages: mockTotalPages,
          numberOfElements: mockPapers,
          targetPaper: mockTargetPaper,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isEnd following isEnd payload", () => {
      expect(state.isEnd).toEqual(mockIsEnd);
    });

    it("should set page following nextPage payload", () => {
      expect(state.page).toEqual(mockPage + 1);
    });

    it("should set searchItemsToShow following papers payload", () => {
      expect(state.searchItemsToShow).toEqual(mockPapers);
    });

    it("should set searchItemsMeta following recordifed initializesearchItemsMeta with numberOfElements payload value", () => {
      expect(JSON.stringify(state.searchItemsMeta)).toEqual(
        JSON.stringify(makeSearchItemMetaListFromPaperList(mockPapers)),
      );
    });

    it("should set totalElements following totalElements payload", () => {
      expect(state.totalElements).toEqual(mockTotalElements);
    });

    it("should set totalPages following totalPages payload", () => {
      expect(state.totalPages).toEqual(mockTotalPages);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });

    it("should set targetPaper following targetPaper payload", () => {
      expect(state.targetPaper).toEqual(mockTargetPaper);
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS", () => {
    const mockPage = 3;
    const mockIsEnd = false;
    const mockTotalElements = 3;
    const mockTotalPages = 23;
    const mockTargetPaper = initialPaper;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS,
        payload: {
          papers: mockPapers,
          nextPage: mockPage + 1,
          isEnd: mockIsEnd,
          totalElements: mockTotalElements,
          totalPages: mockTotalPages,
          numberOfElements: mockPapers,
          targetPaper: mockTargetPaper,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isEnd following isEnd payload", () => {
      expect(state.isEnd).toEqual(mockIsEnd);
    });

    it("should set page following nextPage payload", () => {
      expect(state.page).toEqual(mockPage + 1);
    });

    it("should set searchItemsToShow following papers payload", () => {
      expect(state.searchItemsToShow).toEqual(mockPapers);
    });

    it("should set searchItemsMeta following recordifed initializesearchItemsMeta with numberOfElements payload value", () => {
      expect(JSON.stringify(state.searchItemsMeta)).toEqual(
        JSON.stringify(makeSearchItemMetaListFromPaperList(mockPapers)),
      );
    });

    it("should set totalElements following totalElements payload", () => {
      expect(state.totalElements).toEqual(mockTotalElements);
    });

    it("should set totalPages following totalPages payload", () => {
      expect(state.totalPages).toEqual(mockTotalPages);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });

    it("should set targetPaper following targetPaper payload", () => {
      expect(state.targetPaper).toEqual(mockTargetPaper);
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_CHANGE_COMMENT_INPUT", () => {
    it("should set searchItemsMeta's commentInput following index & comment payload", () => {
      const mockIndex = 0;
      const mockCommentContent = "test";
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockPaperId,
      };
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockPaperId,
        comments: [mockComment],
      });

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsToShow", List([mockPaper]));

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT,
        payload: {
          index: mockIndex,
          comment: mockCommentContent,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.getIn(["searchItemsMeta", mockIndex, "commentInput"])).toEqual(mockCommentContent);
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_POST_COMMENT", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state
          .set("searchItemsToShow", List([mockPaper]))
          .set("searchItemsMeta", SearchItemMetaFactory([initialSearchItemMeta]));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsMeta's hasError to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeFalsy();
      });

      it("should set searchItemsMeta's isLoading to true", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isLoading"])).toBeTruthy();
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state
          .set("searchItemsToShow", List([mockPaper]))
          .set("searchItemsMeta", SearchItemMetaFactory([initialSearchItemMeta]));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockPaperId,
      };
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state
          .set("searchItemsToShow", List([mockPaper]))
          .set("searchItemsMeta", SearchItemMetaFactory([initialSearchItemMeta]));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT,
          payload: {
            comment: recordifyComment(mockComment),
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsToShow's comments to be unshifted with comment payload", () => {
        const newComments = List([recordifyComment(mockComment)]);
        expect(JSON.stringify(state.getIn(["searchItemsToShow", mockKey, "comments"]))).toEqual(
          JSON.stringify(newComments),
        );
      });

      it("should set searchItemsToShow's commentCount to previous value + 1", () => {
        const previousCommentCount = 0;
        expect(state.getIn(["searchItemsToShow", mockKey, "commentCount"])).toEqual(previousCommentCount + 1);
      });

      it("should set searchItemsMeta's hasError to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeFalsy();
      });

      it("should set searchItemsMeta's isLoading to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isLoading"])).toBeFalsy();
      });

      it("should set searchItemsMeta's commentInput to empty string", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "commentInput"])).toEqual("");
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockInValidPaperId,
      };
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state
          .set("searchItemsToShow", List([mockPaper]))
          .set("searchItemsMeta", SearchItemMetaFactory([initialSearchItemMeta]));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT,
          payload: {
            comment: recordifyComment(mockComment),
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_POST_COMMENT", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state
          .set("searchItemsToShow", List([mockPaper]))
          .set("searchItemsMeta", SearchItemMetaFactory([initialSearchItemMeta]));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsMeta's hasError to true", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeTruthy();
      });

      it("should set searchItemsMeta's isLoading to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isLoading"])).toBeFalsy();
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockPaper = PaperFactory({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state
          .set("searchItemsToShow", List([mockPaper]))
          .set("searchItemsMeta", SearchItemMetaFactory([initialSearchItemMeta]));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });
});
