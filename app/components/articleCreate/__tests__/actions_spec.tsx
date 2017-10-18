jest.unmock("../actions");
jest.mock("../../../helpers/makePlutoToastAction", () => {
  return () => {};
});

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import {
  ARTICLE_CREATE_STEP,
  ARTICLE_CATEGORY,
  IArticleCreateState,
  ARTICLE_CREATE_INITIAL_STATE,
  initialAuthorRecord,
} from "../records";
import { IAuthorRecord, recordifyAuthor } from "../../../model/author";
import { List } from "immutable";
import { AUTHOR_NAME_TYPE, AUTHOR_INSTITUTION_TYPE } from "../records";

describe("article create actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeCreateStep action", () => {
    it("should return ARTICLE_CREATE_CHANGE_CREATE_STEP action with step payload", () => {
      const mockStep = ARTICLE_CREATE_STEP.FIRST;
      store.dispatch(Actions.changeCreateStep(mockStep));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
        payload: {
          step: mockStep,
        },
      });
    });
  });

  describe("checkValidateStep action", () => {
    describe("with ARTICLE_CREATE_STEP.FIRST Step", () => {
      const mockCurrentStep = ARTICLE_CREATE_STEP.FIRST;

      it("should return ARTICLE_CREATE_FORM_ERROR action with invalid Url state", () => {
        const mockInvalidUrl = "https:dsfjksdf";
        const mockArticleCreateState: IArticleCreateState = ARTICLE_CREATE_INITIAL_STATE.set(
          "articleLink",
          mockInvalidUrl,
        );

        store.dispatch(Actions.checkValidateStep(mockCurrentStep, mockArticleCreateState));
        const actions = store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
          payload: {
            type: "articleLink",
          },
        });
      });

      it("should return ARTICLE_CREATE_REMOVE_FORM_ERROR action with valid Url state", () => {
        const mockValidUrl = "https://naver.com";
        const mockArticleCreateState: IArticleCreateState = ARTICLE_CREATE_INITIAL_STATE.set(
          "articleLink",
          mockValidUrl,
        );

        store.dispatch(Actions.checkValidateStep(mockCurrentStep, mockArticleCreateState));
        const actions = store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
          payload: {
            type: "articleLink",
          },
        });

        expect(actions[1]).toEqual({
          type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
          payload: {
            step: ARTICLE_CREATE_STEP.SECOND,
          },
        });
      });
    });

    describe("with ARTICLE_CREATE_STEP.SECOND Step", () => {
      const mockCurrentStep = ARTICLE_CREATE_STEP.SECOND;

      it("should return ARTICLE_CREATE_FORM_ERROR action with invalid state", () => {
        const mockEmptyArticleCategory: ARTICLE_CATEGORY = null;
        const mockTooShortArticleTitle: string = "";
        const mockErrorAuthorInput: List<IAuthorRecord> = List([initialAuthorRecord]);
        const mockTooShortSummary: string = "";

        const mockArticleCreateState: IArticleCreateState = ARTICLE_CREATE_INITIAL_STATE.withMutations(currentState => {
          return currentState
            .set("articleCategory", mockEmptyArticleCategory)
            .set("articleTitle", mockTooShortArticleTitle)
            .set("authors", mockErrorAuthorInput)
            .set("summary", mockTooShortSummary);
        });

        store.dispatch(Actions.checkValidateStep(mockCurrentStep, mockArticleCreateState));
        const actions = store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
          payload: {
            type: "articleCategory",
          },
        });
      });

      it("should return ARTICLE_CREATE_CHANGE_CREATE_STEP action with valid Url state", () => {
        const mockId = 1;
        const mockValidArticleCategory: ARTICLE_CATEGORY = "POST_PAPER";
        const mockValidArticleTitle: string = "test Article Title";
        const mockValidAuthor: IAuthorRecord = recordifyAuthor({
          id: mockId,
          type: null,
          institution: "test Institution",
          name: "testName",
          member: null,
        });
        const mockValidAuthorInput: List<IAuthorRecord> = List([mockValidAuthor]);
        const mockValidSummary: string = "test Summary";

        const mockArticleCreateState: IArticleCreateState = ARTICLE_CREATE_INITIAL_STATE.withMutations(currentState => {
          return currentState
            .set("articleCategory", mockValidArticleCategory)
            .set("articleTitle", mockValidArticleTitle)
            .set("authors", mockValidAuthorInput)
            .set("summary", mockValidSummary);
        });

        store.dispatch(Actions.checkValidateStep(mockCurrentStep, mockArticleCreateState));
        const actions = store.getActions();
        expect(actions[5]).toEqual({
          type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
          payload: {
            step: ARTICLE_CREATE_STEP.FINAL,
          },
        });
      });

      describe("with ARTICLE_CREATE_STEP.FINAL Step", () => {
        const mockCurrentStep = ARTICLE_CREATE_STEP.FINAL;

        it("should return ARTICLE_CREATE_START_TO_CREATE_ARTICLE action with valid payload", () => {
          const mockId = 1;
          const mockValidArticleCategory: ARTICLE_CATEGORY = "POST_PAPER";
          const mockValidArticleTitle: string = "test Article Title";
          const mockValidAuthor: IAuthorRecord = recordifyAuthor({
            id: mockId,
            type: 'CO_AUTHOR',
            institution: "test Institution",
            name: "testName",
            member: null,
          });
          const mockValidAuthorInput: List<IAuthorRecord> = List([mockValidAuthor]);
          const mockValidSummary: string = "test Summary";

          const mockArticleCreateState: IArticleCreateState = ARTICLE_CREATE_INITIAL_STATE.withMutations(currentState => {
            return currentState
              .set("articleCategory", mockValidArticleCategory)
              .set("articleTitle", mockValidArticleTitle)
              .set("authors", mockValidAuthorInput)
              .set("summary", mockValidSummary);
          });

          store.dispatch(Actions.checkValidateStep(mockCurrentStep, mockArticleCreateState));
          const actions = store.getActions();
          expect(actions[0]).toEqual({type: ACTION_TYPES.ARTICLE_CREATE_START_TO_CREATE_ARTICLE,});
        });
    });
  });

  describe("toggleArticleCategoryDropDown action", () => {
    it("should return ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN action with toggled value", () => {
      store.dispatch(Actions.toggleArticleCategoryDropDown());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN,
      });
    });
  });

  describe("selectArticleCategory action", () => {
    it("should return ARTICLE_CREATE_SELECT_ARTICLE_CATEGORY action with category payload", () => {
      const mockCategory: ARTICLE_CATEGORY = "POST_PAPER";
      store.dispatch(Actions.selectArticleCategory(mockCategory));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_SELECT_ARTICLE_CATEGORY,
        payload: {
          category: mockCategory,
        },
      });
    });
  });

  describe("checkValidArticleCategory action", () => {
    it("should return ARTICLE_CREATE_FORM_ERROR action with empty category payload", () => {
      const mockCategory: ARTICLE_CATEGORY = null;
      store.dispatch(Actions.checkValidArticleCategory(mockCategory));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          type: "articleCategory",
        },
      });
    });

    it("should return ARTICLE_CREATE_REMOVE_FORM_ERROR action with valid category payload", () => {
      const mockCategory: ARTICLE_CATEGORY = "POST_PAPER";
      store.dispatch(Actions.checkValidArticleCategory(mockCategory));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
        payload: {
          type: "articleCategory",
        },
      });
    });
  });

  describe("plusAuthor action", () => {
    it("should return ARTICLE_CREATE_PLUS_AUTHOR action", () => {
      store.dispatch(Actions.plusAuthor());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_PLUS_AUTHOR,
      });
    });
  });

  describe("minusAuthor action", () => {
    it("should return ARTICLE_CREATE_MINUS_AUTHOR action", () => {
      store.dispatch(Actions.minusAuthor());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_MINUS_AUTHOR,
      });
    });
  });

  describe("changeArticleLink action", () => {
    it("should return ARTICLE_CREATE_CHANGE_ARTICLE_LINK action with articleLink payload", () => {
      const mockArticleLink: string = "https://www.naver.com";
      store.dispatch(Actions.changeArticleLink(mockArticleLink));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_LINK,
        payload: {
          articleLink: mockArticleLink,
        },
      });
    });
  });

  describe("checkValidArticleLink action", () => {
    it("should return ARTICLE_CREATE_FORM_ERROR action with Invalid articleLink payload", () => {
      const invalidArticleLink: string = "htsfdj:/";
      store.dispatch(Actions.checkValidArticleLink(invalidArticleLink));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          type: "articleLink",
        },
      });
    });

    it("should return ARTICLE_CREATE_REMOVE_FORM_ERROR action with valid articleLink payload", () => {
      const validArticleLink: string = "https://www.naver.com";
      store.dispatch(Actions.checkValidArticleLink(validArticleLink));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
        payload: {
          type: "articleLink",
        },
      });
    });
  });

  describe("changeArticleTitle action", () => {
    it("should return ARTICLE_CREATE_CHANGE_ARTICLE_TITLE action with articleTitle payload", () => {
      const mockArticleTitle: string = "test Article Title";
      store.dispatch(Actions.changeArticleTitle(mockArticleTitle));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_TITLE,
        payload: {
          articleTitle: mockArticleTitle,
        },
      });
    });
  });

  describe("checkValidArticleTitle action", () => {
    it("should return ARTICLE_CREATE_FORM_ERROR action with too short articleTitle payload", () => {
      const tooShortArticleTitle: string = "";
      store.dispatch(Actions.checkValidArticleTitle(tooShortArticleTitle));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          type: "articleTitle",
        },
      });
    });

    it("should return ARTICLE_CREATE_REMOVE_FORM_ERROR action with valid articleTitle payload", () => {
      const validArticleTitle: string = "test Article Title";
      store.dispatch(Actions.checkValidArticleTitle(validArticleTitle));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
        payload: {
          type: "articleTitle",
        },
      });
    });
  });

  describe("changeAuthorName action", () => {
    it("should return ARTICLE_CREATE_CHANGE_AUTHOR_NAME action with index and name payload", () => {
      const mockIndex: number = 0;
      const mockName: string = "test Name";
      store.dispatch(Actions.changeAuthorName(mockIndex, mockName));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_NAME,
        payload: {
          index: mockIndex,
          name: mockName,
        },
      });
    });
  });

  describe("checkValidAuthorName action", () => {
    it("should return ARTICLE_CREATE_FORM_ERROR action with too short name payload", () => {
      const mockIndex: number = 0;
      const tooShortName: string = "";
      store.dispatch(Actions.checkValidAuthorName(mockIndex, tooShortName));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          index: mockIndex,
          type: AUTHOR_NAME_TYPE,
        },
      });
    });

    it("should return ARTICLE_CREATE_REMOVE_FORM_ERROR action with valid name payload", () => {
      const mockIndex: number = 0;
      const validName: string = "test Name";
      store.dispatch(Actions.checkValidAuthorName(mockIndex, validName));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
        payload: {
          index: mockIndex,
          type: AUTHOR_NAME_TYPE,
        },
      });
    });
  });

  describe("changeAuthorInstitution action", () => {
    it("should return ARTICLE_CREATE_CHANGE_AUTHOR_INSTITUTION action with index and institution payload", () => {
      const mockIndex: number = 0;
      const mockInstitution: string = "test Institution";
      store.dispatch(Actions.changeAuthorInstitution(mockIndex, mockInstitution));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_INSTITUTION,
        payload: {
          index: mockIndex,
          institution: mockInstitution,
        },
      });
    });
  });

  describe("checkValidAuthorInstitution action", () => {
    it("should return ARTICLE_CREATE_FORM_ERROR action with too short institution payload", () => {
      const mockIndex: number = 0;
      const tooShortInstitution: string = "";
      store.dispatch(Actions.checkValidAuthorInstitution(mockIndex, tooShortInstitution));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          index: mockIndex,
          type: AUTHOR_INSTITUTION_TYPE,
        },
      });
    });

    it("should return ARTICLE_CREATE_REMOVE_FORM_ERROR action with valid institution payload", () => {
      const mockIndex: number = 0;
      const validInstitution: string = "test Institution";
      store.dispatch(Actions.checkValidAuthorInstitution(mockIndex, validInstitution));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
        payload: {
          index: mockIndex,
          type: AUTHOR_INSTITUTION_TYPE,
        },
      });
    });
  });

  describe("changeSummary action", () => {
    it("should return ARTICLE_CREATE_CHANGE_SUMMARY action with summary payload", () => {
      const mockSummary: string = "test Summary";
      store.dispatch(Actions.changeSummary(mockSummary));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_SUMMARY,
        payload: {
          summary: mockSummary,
        },
      });
    });
  });

  describe("checkValidSummary action", () => {
    it("should return ARTICLE_CREATE_FORM_ERROR action with too short summary payload", () => {
      const tooShortSummary: string = "";
      store.dispatch(Actions.checkValidSummary(tooShortSummary));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
        payload: {
          type: "summary",
        },
      });
    });

    it("should return ARTICLE_CREATE_REMOVE_FORM_ERROR action with valid summary payload", () => {
      const validSummary: string = "test Summary";
      store.dispatch(Actions.checkValidSummary(validSummary));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
        payload: {
          type: "summary",
        },
      });
    });
  });

  describe("changeNote action", () => {
    it("should return ARTICLE_CREATE_CHANGE_NOTE action with note payload", () => {
      const mockNote: string = "test Note";
      store.dispatch(Actions.changeNote(mockNote));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_NOTE,
        payload: {
          note: mockNote,
        },
      });
    });
  });
});
