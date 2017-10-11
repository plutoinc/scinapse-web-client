jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IArticleCreateStateRecord, ARTICLE_CREATE_INITIAL_STATE, ARTICLE_CREATE_STEP } from "../records";

function reduceState(action: any, state: IArticleCreateStateRecord = ARTICLE_CREATE_INITIAL_STATE) {
  return reducer(state, action);
}

describe("articleCreate reducer", () => {
  let mockAction: any;
  let state: IArticleCreateStateRecord;

  beforeEach(() => {
    state = ARTICLE_CREATE_INITIAL_STATE;
  });

  describe("when receive ARTICLE_CREATE_CHANGE_CREATE_STEP", () => {
    it("should set step following payload", () => {
      const mockStep: ARTICLE_CREATE_STEP = ARTICLE_CREATE_STEP.FIRST;

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
        payload: {
          step: mockStep,
        },
      };

      state = reduceState(mockAction);

      expect(state.currentStep).toEqual(mockStep);
    });
  });

  describe("when receive ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN", () => {
    it("should set true when it was false", () => {
      const mockState = ARTICLE_CREATE_INITIAL_STATE.set("isArticleCategoryDropDownOpen", false);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN,
      };

      state = reduceState(mockAction, mockState);
      expect(state.isArticleCategoryDropDownOpen).toBeTruthy();
    });

    it("should set false when it was true", () => {
      const mockState = ARTICLE_CREATE_INITIAL_STATE.set("isArticleCategoryDropDownOpen", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN,
      };

      state = reduceState(mockAction, mockState);
      expect(state.isArticleCategoryDropDownOpen).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_CREATE_PLUS_AUTHOR", () => {
    it("should plus one author to default authors state", () => {
      const beforeAuthorSize = state.authors.size;
      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_PLUS_AUTHOR,
      };
      state = reduceState(mockAction);

      expect(state.authors.size).toEqual(beforeAuthorSize + 1);
    });
  });

  describe("when receive ARTICLE_CREATE_MINUS_AUTHOR", () => {
    it("should minus one author to default authors state", () => {
      const beforeAuthorSize = state.authors.size;

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_MINUS_AUTHOR,
      };
      state = reduceState(mockAction);

      expect(state.authors.size).toEqual(beforeAuthorSize - 1);
    });
  });

  describe("when receive ARTICLE_CREATE_CHANGE_ARTICLE_LINK", () => {
    it("should set articleLink following payload", () => {
      const mockArticleLink = "https://test.article.link";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_LINK,
        payload: {
          articleLink: mockArticleLink,
        },
      };

      state = reduceState(mockAction);

      expect(state.articleLink).toEqual(mockArticleLink);
    });
  });

  describe("when receive ARTICLE_CREATE_CHANGE_ARTICLE_TITLE", () => {
    it("should set articleTitle following payload", () => {
      const mockArticleTitle = "test Article Title";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_TITLE,
        payload: {
          articleTitle: mockArticleTitle,
        },
      };

      state = reduceState(mockAction);

      expect(state.articleTitle).toEqual(mockArticleTitle);
    });
  });

  describe("when receive ARTICLE_CREATE_CHANGE_AUTHOR_NAME", () => {
    it("should set author name following index and name payload", () => {
      const mockIndex = 0;
      const mockName = "test Name";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_NAME,
        payload: {
          index: mockIndex,
          name: mockName,
        },
      };

      state = reduceState(mockAction);

      expect(state.authors.getIn([mockIndex, "name"])).toEqual(mockName);
    });
  });

  describe("when receive ARTICLE_CREATE_CHANGE_AUTHOR_INSTITUTION", () => {
    it("should set author institution following index and institution payload", () => {
      const mockIndex = 0;
      const mockInstitution = "test Institution";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_INSTITUTION,
        payload: {
          index: mockIndex,
          institution: mockInstitution,
        },
      };

      state = reduceState(mockAction);

      expect(state.authors.getIn([mockIndex, "institution"])).toEqual(mockInstitution);
    });
  });

  describe("when receive ARTICLE_CREATE_CHANGE_ABSTRACT", () => {
    it("should set abstract following payload", () => {
      const mockAbstract = "test Abstract";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ABSTRACT,
        payload: {
          abstract: mockAbstract,
        },
      };

      state = reduceState(mockAction);

      expect(state.abstract).toEqual(mockAbstract);
    });
  });

  describe("when receive ARTICLE_CREATE_CHANGE_NOTE", () => {
    it("should set note following payload", () => {
      const mockNote = "test Abstract";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_NOTE,
        payload: {
          note: mockNote,
        },
      };

      state = reduceState(mockAction);

      expect(state.note).toEqual(mockNote);
    });
  });

  describe("when receive ARTICLE_CREATE_FORM_ERROR", () => {
    it("should set errorType following type payload", () => {
      const mockErrorType = "abstract";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          type: mockErrorType,
        },
      };

      state = reduceState(mockAction);

      expect(state.hasErrorCheck[mockErrorType]).toBeTruthy();
    });
    // TODO : With Author Input Error
    it("should set errorType following type payload", () => {
      const mockErrorType = "abstract";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          type: mockErrorType,
        },
      };

      state = reduceState(mockAction);

      expect(state.hasErrorCheck[mockErrorType]).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_CREATE_REMOVE_FORM_ERROR", () => {
    it("should set errorType following type payload", () => {
      const mockErrorType = "abstract";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
        payload: {
          type: mockErrorType,
        },
      };

      state = reduceState(mockAction);

      expect(state.hasErrorCheck[mockErrorType]).toBeFalsy();
    });
  });

  describe("when receive GLOBAL_LOCATION_CHANGE", () => {
    it("should set state be initial state", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(ARTICLE_CREATE_INITIAL_STATE);
    });
  });
});
