jest.unmock("../reducer");
jest.unmock("../records");

import { List } from "immutable";
import { reducer } from "../reducer";
import {
  PaperShowStateRecord,
  PaperShowStateFactory,
  PAPER_SHOW_INITIAL_STATE,
  initialPaperShowState,
  RelatedPaperMetaFactory,
} from "../records";
import { IReduxAction } from "../../../typings/actionType";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { RECORD, RAW } from "../../../__mocks__";

describe("PaperShow reducer", () => {
  let mockAction: IReduxAction<any>;
  let mockState: PaperShowStateRecord;
  let state: PaperShowStateRecord;

  describe("when reducer get PAPER_SHOW_SUCCEEDED_TO_GET_PAPER action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
        payload: {
          paper: RECORD.PAPER,
        },
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingPaper", true)
          .set("isLoadingPaper", true)
          .set("paper", null);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingPaper to false", () => {
      expect(state.hasErrorOnFetchingPaper).toBeFalsy();
    });

    it("should set isLoadingPaper to false", () => {
      expect(state.isLoadingPaper).toBeFalsy();
    });

    it("should set paper to payload's paper value", () => {
      expect(state.paper.toJS()).toEqual(RECORD.PAPER.toJS());
    });
  });

  describe("when reducer get PAPER_SHOW_START_TO_GET_PAPER action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState.set("hasErrorOnFetchingPaper", true).set("isLoadingPaper", false);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingPaper to false", () => {
      expect(state.hasErrorOnFetchingPaper).toBeFalsy();
    });

    it("should set isLoadingPaper to true", () => {
      expect(state.isLoadingPaper).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_FAILED_TO_GET_PAPER action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingPaper", false)
          .set("isLoadingPaper", true)
          .set("paper", null);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingPaper to true", () => {
      expect(state.hasErrorOnFetchingPaper).toBeTruthy();
    });

    it("should set isLoadingPaper to false", () => {
      expect(state.isLoadingPaper).toBeFalsy();
    });

    it("should set paper to null value", () => {
      expect(state.paper).toBeNull();
    });
  });

  describe("when reducer get PAPER_SHOW_CLEAR_PAPER_SHOW_STATE action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingPaper", true)
          .set("isLoadingPaper", true)
          .set("paper", RECORD.PAPER);
      });

      state = reducer(mockState, mockAction);
    });

    it("should return PAPER_SHOW_INITIAL_STATE", () => {
      expect(state).toEqual(PAPER_SHOW_INITIAL_STATE);
    });
  });

  describe("when reducer get PAPER_SHOW_START_TO_GET_COMMENTS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState.set("hasErrorOnFetchingComments", true).set("isLoadingComments", false);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingComments to false", () => {
      expect(state.hasErrorOnFetchingComments).toBeFalsy();
    });

    it("should set isLoadingComments to true", () => {
      expect(state.isLoadingComments).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_START_TO_GET_COMMENTS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState.set("hasErrorOnFetchingComments", true).set("isLoadingComments", false);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingComments to false", () => {
      expect(state.hasErrorOnFetchingComments).toBeFalsy();
    });

    it("should set isLoadingComments to true", () => {
      expect(state.isLoadingComments).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_FAILED_TO_GET_COMMENTS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingComments", false)
          .set("isLoadingComments", true)
          .set("comments", List([RECORD.COMMENT]));
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingComments to true", () => {
      expect(state.hasErrorOnFetchingComments).toBeTruthy();
    });

    it("should set isLoadingComments to false", () => {
      expect(state.isLoadingComments).toBeFalsy();
    });

    it("should set comments to null", () => {
      expect(state.comments).toBeNull();
    });
  });

  describe("when reducer get PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS,
        payload: {
          commentsResponse: RECORD.COMMENTS_RESPONSE,
        },
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingComments", true)
          .set("isLoadingComments", true)
          .set("currentCommentPage", 5)
          .set("commentTotalPage", 10);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingComments to false", () => {
      expect(state.hasErrorOnFetchingComments).toBeFalsy();
    });

    it("should set isLoadingComments to false", () => {
      expect(state.isLoadingComments).toBeFalsy();
    });

    it("should set currentCommentPage to payload's value", () => {
      expect(state.currentCommentPage).toBe(0);
    });

    it("should set commentTotalPage to payload's value", () => {
      expect(state.commentTotalPage).toBe(4);
    });

    it("should set comments to payload's comments", () => {
      expect(state.comments.size).toBeGreaterThan(0);
    });
  });

  describe("when reducer get PAPER_SHOW_CHANGE_COMMENT_INPUT action", () => {
    const mockCommentInput = "123";

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_CHANGE_COMMENT_INPUT,
        payload: {
          comment: mockCommentInput,
        },
      };

      mockState = PaperShowStateFactory();

      state = reducer(mockState, mockAction);
    });

    it("should set commentInput value to payload's value", () => {
      expect(state.commentInput).toEqual(mockCommentInput);
    });
  });

  describe("when reducer get PAPER_SHOW_START_TO_POST_COMMENT action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT,
      };

      mockState = PaperShowStateFactory();

      state = reducer(mockState, mockAction);
    });

    it("should set isPostingComment value to true", () => {
      expect(state.isPostingComment).toBeTruthy();
    });

    it("should set isFailedToPostingComment value to false", () => {
      expect(state.isFailedToPostingComment).toBeFalsy();
    });
  });

  describe("when reducer get PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT,
        payload: {
          comment: RECORD.COMMENT,
        },
      };

      mockState = PaperShowStateFactory({ ...initialPaperShowState, ...{ paper: RAW.PAPER } });

      state = reducer(mockState, mockAction);
    });

    it("should set isPostingComment value to false", () => {
      expect(state.isPostingComment).toBeFalsy();
    });

    it("should set isFailedToPostingComment value to false", () => {
      expect(state.isFailedToPostingComment).toBeFalsy();
    });

    it("should set commentInput to empty string", () => {
      expect(state.commentInput).toEqual("");
    });

    it("should add payload's comment to comments list ", () => {
      expect(state.comments.get(0).toJS()).toEqual(RECORD.COMMENT.toJS());
    });

    it("should increase state's paper's commentCount attribute 1", () => {
      expect(state.paper.commentCount).toEqual(2); // Mock Paper's commentCount was 1
    });
  });

  describe("when reducer get PAPER_SHOW_FAILED_TO_POST_COMMENT action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT,
      };

      mockState = PaperShowStateFactory();

      state = reducer(mockState, mockAction);
    });

    it("should set isPostingComment value to false", () => {
      expect(state.isPostingComment).toBeFalsy();
    });

    it("should set isFailedToPostingComment value to true", () => {
      expect(state.isFailedToPostingComment).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_START_TO_GET_RELATED_PAPERS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS,
      };

      const modifiedState = {
        ...initialPaperShowState,
        ...{
          isLoadingRelatedPapers: false,
          isFailedToGetRelatedPapers: true,
          relatedPapersMeta: [RelatedPaperMetaFactory()],
        },
      };

      mockState = PaperShowStateFactory(modifiedState);

      state = reducer(mockState, mockAction);
    });

    it("should change isLoadingRelatedPapers state to true", () => {
      expect(state.isLoadingRelatedPapers).toBeTruthy();
    });

    it("should change isFailedToGetRelatedPapers state to false", () => {
      expect(state.isFailedToGetRelatedPapers).toBeFalsy();
    });
  });

  describe("when reducer get PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS,
        payload: {
          papers: List([RECORD.PAPER]),
          currentPage: 1,
          isEnd: false,
          totalElements: 100,
          totalPages: 100,
          numberOfElements: 10000,
        },
      };

      const modifiedState = {
        ...initialPaperShowState,
        ...{ isLoadingRelatedPapers: true, isFailedToGetRelatedPapers: true },
      };

      mockState = PaperShowStateFactory(modifiedState);

      state = reducer(mockState, mockAction);
    });

    it("should change isLoadingRelatedPapers state to false", () => {
      expect(state.isLoadingRelatedPapers).toBeFalsy();
    });

    it("should change isFailedToGetRelatedPapers state to false", () => {
      expect(state.isFailedToGetRelatedPapers).toBeFalsy();
    });

    it("should set relatedPaperTotalPage state to payload's totalPages value", () => {
      expect(state.relatedPaperTotalPage).toEqual(100);
    });

    it("should set relatedPaperCurrentPage state to payload's currentPage value", () => {
      expect(state.relatedPaperCurrentPage).toEqual(1);
    });

    it("should set relatedPapersMeta with initial value as the size of the payload's paper", () => {
      expect(state.relatedPapersMeta.size).toEqual(1);
    });

    it("should set relatedPapers data", () => {
      expect(state.relatedPapers.toJS()).toEqual(List([RECORD.PAPER]).toJS());
    });
  });

  describe("when reducer get PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS,
      };

      const modifiedState = {
        ...initialPaperShowState,
        ...{ isLoadingRelatedPapers: true, isFailedToGetRelatedPapers: false },
      };

      mockState = PaperShowStateFactory(modifiedState);

      state = reducer(mockState, mockAction);
    });

    it("should change isLoadingRelatedPapers state to false", () => {
      expect(state.isLoadingRelatedPapers).toBeFalsy();
    });

    it("should change isFailedToGetRelatedPapers state to true", () => {
      expect(state.isFailedToGetRelatedPapers).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_TOGGLE_ABSTRACT action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_TOGGLE_ABSTRACT,
        payload: {
          paperId: 101,
        },
      };

      const modifiedState = {
        ...initialPaperShowState,
        ...{
          relatedPapersMeta: [RelatedPaperMetaFactory(101)],
        },
      };

      mockState = PaperShowStateFactory(modifiedState);

      state = reducer(mockState, mockAction);
    });

    it("should set target meta's isAbstractOpen state to opposite value of current value", () => {
      expect(state.relatedPapersMeta.get(0).isAbstractOpen).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_TOGGLE_AUTHORS action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHORS,
        payload: {
          paperId: 101,
        },
      };

      const modifiedState = {
        ...initialPaperShowState,
        ...{
          relatedPapersMeta: [RelatedPaperMetaFactory(101)],
        },
      };

      mockState = PaperShowStateFactory(modifiedState);

      state = reducer(mockState, mockAction);
    });

    it("should set target meta's isAuthorsOpen state to opposite value of current value", () => {
      expect(state.relatedPapersMeta.get(0).isAuthorsOpen).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_VISIT_TITLE action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_VISIT_TITLE,
        payload: {
          paperId: 101,
        },
      };

      const modifiedState = {
        ...initialPaperShowState,
        ...{
          relatedPapersMeta: [RelatedPaperMetaFactory(101)],
        },
      };

      mockState = PaperShowStateFactory(modifiedState);

      state = reducer(mockState, mockAction);
    });

    it("should set target meta's isAuthorsOpen state to true", () => {
      expect(state.relatedPapersMeta.get(0).isTitleVisited).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_CLOSE_FIRST_OPEN action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_CLOSE_FIRST_OPEN,
        payload: {
          paperId: 101,
        },
      };

      const modifiedState = {
        ...initialPaperShowState,
        ...{
          relatedPapersMeta: [RelatedPaperMetaFactory(101)],
        },
      };

      mockState = PaperShowStateFactory(modifiedState);

      state = reducer(mockState, mockAction);
    });

    it("should set target meta's isAuthorsOpen state to false", () => {
      expect(state.relatedPapersMeta.get(0).isFirstOpen).toBeFalsy();
    });
  });

  describe("when reducer get PAPER_SHOW_START_TO_DELETE_COMMENT action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT,
      };

      mockState = PaperShowStateFactory();

      state = reducer(mockState, mockAction);
    });

    it("should set isDeletingComment to true", () => {
      expect(state.isDeletingComment).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT action", () => {
    beforeEach(() => {
      const mockComments = List([RECORD.COMMENT, RECORD.COMMENT, RECORD.COMMENT]);

      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT,
        payload: {
          paperId: 1,
          commentId: RECORD.COMMENT.id,
        },
      };

      mockState = PaperShowStateFactory()
        .set("comments", mockComments)
        .set("isDeletingComment", true)
        .set("paper", RECORD.PAPER);

      state = reducer(mockState, mockAction);
    });

    it("should remove target comment from comments state", () => {
      expect(state.comments.size).toEqual(2);
    });

    it("should decrease paper's commentCount state", () => {
      expect(state.paper.commentCount).toEqual(0); // Mock paper's commentCount was 1
    });

    it("should set isDeletingComment to false", () => {
      expect(state.isDeletingComment).toBeFalsy();
    });
  });

  describe("when reducer get PAPER_SHOW_FAILED_TO_DELETE_COMMENT action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT,
      };

      mockState = PaperShowStateFactory().set("isDeletingComment", true);

      state = reducer(mockState, mockAction);
    });

    it("should set isDeletingComment to false", () => {
      expect(state.isDeletingComment).toBeFalsy();
    });
  });
});
