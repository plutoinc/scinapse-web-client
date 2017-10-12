jest.unmock("../records");

import { List } from "immutable";
import { IAuthorRecord } from "../../../model/author";
import { initialErrorCheck, IArticleCreateHasErrorCheckRecord } from "../records";
import {
  initialAuthorRecord,
  ArticleCreateStateFactory,
  IArticleCreateStateRecord,
  ARTICLE_CREATE_INITIAL_STATE,
  IArticleCreateState,
  ARTICLE_CATEGORY,
  ARTICLE_CREATE_STEP,
} from "../records";

describe("ArticleCreate records", () => {
  describe("ArticleCreateStateFactory function", () => {
    let state: IArticleCreateStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = ArticleCreateStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(ARTICLE_CREATE_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockCurrentStep: ARTICLE_CREATE_STEP = ARTICLE_CREATE_STEP.FIRST;
      const mockArticleCategory: ARTICLE_CATEGORY = "Post Paper";
      const mockArticleLink: string = "https://naver.com";
      const mockArticleTitle: string = "test Article Title";
      const mockAuthors: List<IAuthorRecord> = List([initialAuthorRecord]);
      const mockAbstract: string = "test Abstract";
      const mockNote: string = "test Note";
      const mockErrorCheck: IArticleCreateHasErrorCheckRecord = initialErrorCheck;

      beforeEach(() => {
        const jsState: IArticleCreateState = {
          isLoading: false,
          hasError: false,
          currentStep: mockCurrentStep,
          isArticleCategoryDropDownOpen: false,
          articleCategory: mockArticleCategory,
          articleLink: mockArticleLink,
          articleTitle: mockArticleTitle,
          authors: mockAuthors,
          abstract: mockAbstract,
          note: mockNote,
          hasErrorCheck: mockErrorCheck,
        };

        state = ArticleCreateStateFactory(jsState);
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

      it("should have param's currentStep value", () => {
        expect(state.currentStep).toEqual(mockCurrentStep);
      });

      it("should have param's isArticleCategoryDropDownOpen value", () => {
        expect(state.isArticleCategoryDropDownOpen).toBeFalsy();
      });

      it("should have param's articleCategory value", () => {
        expect(state.articleCategory).toEqual(mockArticleCategory);
      });

      it("should have param's articleLink value", () => {
        expect(state.articleLink).toEqual(mockArticleLink);
      });

      it("should have param's articleTitle value", () => {
        expect(state.articleTitle).toEqual(mockArticleTitle);
      });

      it("should have param's authors value", () => {
        expect(state.authors).toEqual(mockAuthors);
      });

      it("should have param's abstract value", () => {
        expect(state.abstract).toEqual(mockAbstract);
      });

      it("should have param's note value", () => {
        expect(state.note).toEqual(mockNote);
      });

      it("should have param's errorCheck value", () => {
        expect(state.hasErrorCheck).toEqual(mockErrorCheck);
      });
    });
  });
});
