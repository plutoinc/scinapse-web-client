jest.unmock("..");
jest.mock("../../helpers/makePlutoToastAction");

import { recordifyAppState, AppState, rawInitialState } from "..";
import { SIGN_UP_INITIAL_STATE } from "../../components/auth/signUp/records";
import { CURRENT_USER_INITIAL_STATE } from "../../model/currentUser";
import { SIGN_IN_INITIAL_STATE } from "../../components/auth/signIn/records";
import { AUTH_CHECKER_INITIAL_STATE } from "../../components/authChecker/reducer";
import { LAYOUT_INITIAL_STATE } from "../../components/layouts/records";
import { ARTICLE_SEARCH_INITIAL_STATE } from "../../components/articleSearch/records";
import { EMAIL_VERIFICATION_INITIAL_STATE } from "../../components/auth/emailVerification/records";
import { DIALOG_INITIAL_STATE } from "../../components/dialog/reducer";

describe("Root Reducer spec", () => {
  describe("recordifyAppState function", () => {
    let result: AppState;

    beforeEach(() => {
      result = recordifyAppState(rawInitialState);
    });

    it("should return routing attribute itself", () => {
      expect(result.routing).toEqual({});
    });

    it("should return recordified signUp state", () => {
      expect(result.signUp.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with SIGN_UP_INITIAL_STATE", () => {
      expect(result.signUp.toJS()).toEqual(SIGN_UP_INITIAL_STATE.toJS());
    });

    it("should return recordified signIn state", () => {
      expect(result.signIn.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with SIGN_IN_INITIAL_STATE", () => {
      expect(result.signIn.toJS()).toEqual(SIGN_IN_INITIAL_STATE.toJS());
    });

    it("should return recordified currentUser state", () => {
      expect(result.currentUser.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with CURRENT_USER_INITIAL_STATE", () => {
      expect(result.currentUser).toEqual(CURRENT_USER_INITIAL_STATE);
    });

    it("should return recordified authChecker state", () => {
      expect(result.authChecker.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with AUTH_CHECKER_INITIAL_STATE", () => {
      expect(result.authChecker).toEqual(AUTH_CHECKER_INITIAL_STATE);
    });

    it("should return recordified dialog state", () => {
      expect(result.dialog.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with DIALOG_INITIAL_STATE", () => {
      expect(result.dialog).toEqual(DIALOG_INITIAL_STATE);
    });

    it("should return recordified layout state", () => {
      expect(result.layout.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with LAYOUT_INITIAL_STATE", () => {
      expect(result.layout).toEqual(LAYOUT_INITIAL_STATE);
    });

    it("should return recordified articleSearch state", () => {
      expect(result.articleSearch.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with ARTICLE_SEARCH_INITIAL_STATE", () => {
      expect(result.articleSearch).toEqual(ARTICLE_SEARCH_INITIAL_STATE);
    });

    it("should return recordified emailVerification state", () => {
      expect(result.emailVerification.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with EMAIL_VERIFICATION_INITIAL_STATE", () => {
      expect(result.emailVerification).toEqual(EMAIL_VERIFICATION_INITIAL_STATE);
    });
  });
});
