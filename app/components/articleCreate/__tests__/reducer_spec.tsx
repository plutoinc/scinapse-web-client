jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE, AUTHOR_NAME_TYPE } from "../records";
import {
  IArticleCreateStateRecord,
  ARTICLE_CREATE_INITIAL_STATE,
  ARTICLE_CREATE_STEP,
  ARTICLE_CREATE_ERROR_TYPE,
} from "../records";

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

      expect(state.authors.getIn([mockIndex, "organization"])).toEqual(mockInstitution);
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
    it("should set errorType and error Content following payload", () => {
      const mockErrorType: ARTICLE_CREATE_ERROR_TYPE = "abstract";
      const mockErrorContent = "";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          type: mockErrorType,
          content: mockErrorContent,
        },
      };

      state = reduceState(mockAction);

      expect(state.errorType).toEqual(mockErrorType);
      expect(state.errorContent).toEqual(mockErrorContent);
      expect(state.authorInputErrorIndex).toBeNull();
      expect(state.authorInputErrorType).toBeNull();
    });
  });

  describe("when receive ARTICLE_CREATE_REMOVE_FORM_ERROR", () => {
    it("should set errorType and error Content and authorInputErrorIndex and authorInputErrorType to be null", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      };

      state = reduceState(mockAction);

      expect(state.errorType).toBeNull();
      expect(state.errorContent).toBeNull();
      expect(state.authorInputErrorIndex).toBeNull();
      expect(state.authorInputErrorType).toBeNull();
    });
  });

  describe("when receive ARTICLE_CREATE_AUTHOR_INPUT_ERROR", () => {
    it("should set authorInputErrorIndex and authorInputErrorType following payload", () => {
      const mockAuthorInputErrorIndex = 0;
      const mockAuthorInputErrorType: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = AUTHOR_NAME_TYPE;

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
        payload: {
          index: mockAuthorInputErrorIndex,
          type: mockAuthorInputErrorType,
        },
      };

      state = reduceState(mockAction);

      expect(state.errorType).toEqual("authorInput");
      expect(state.errorContent).toBeNull();
      expect(state.authorInputErrorIndex).toEqual(mockAuthorInputErrorIndex);
      expect(state.authorInputErrorType).toEqual(mockAuthorInputErrorType);
    });
  });

  describe("when receive ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP", () => {
    it("should set validEachStep be true following step payload", () => {
      const mockSucceedStep = 0;

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP,
        payload: {
          step: mockSucceedStep,
        },
      };

      state = reduceState(mockAction);

      expect(state.getIn(["validEachStep", mockSucceedStep])).toEqual(true);
      expect(state.errorType).toBeNull();
      expect(state.errorContent).toBeNull();
      expect(state.authorInputErrorIndex).toBeNull();
      expect(state.authorInputErrorType).toBeNull();
    });
  });

  describe("when receive ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP", () => {
    it("should set validEachStep be false following step payload", () => {
      const mockFailedStep = 0;

      mockAction = {
        type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
        payload: {
          step: mockFailedStep,
        },
      };

      state = reduceState(mockAction);

      expect(state.getIn(["validEachStep", mockFailedStep])).toEqual(false);
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
