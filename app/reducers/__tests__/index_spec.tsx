jest.unmock("..");

import { recordifyAppState, RawAppState, AppState } from "..";
import { signUpInitialState, SIGN_UP_INITIAL_STATE } from "../../components/auth/signUp/records";
import { initialCurrentUser, CURRENT_USER_INITIAL_STATE } from "../../model/currentUser";
import { initialSignInState, SIGN_IN_INITIAL_STATE } from "../../components/auth/signIn/records";
import { initialAuthCheckerState, AUTH_CHECKER_INITIAL_STATE } from "../../components/authChecker/records";
import { initialDialogState, DIALOG_INITIAL_STATE } from "../../components/dialog/records";
import { initialLayoutState, LAYOUT_INITIAL_STATE } from "../../components/layouts/records";
import { initialArticleSearchState, ARTICLE_SEARCH_INITIAL_STATE } from "../../components/articleSearch/records";
import {
  initialEmailVerificationState,
  EMAIL_VERIFICATION_INITIAL_STATE,
} from "../../components/auth/emailVerification/records";

describe("Root Reducer spec", () => {
  let rawAppState: RawAppState;
  const mockRouting = { mock: "routing" };

  beforeEach(() => {
    rawAppState = {
      routing: mockRouting,
      signUp: signUpInitialState,
      signIn: initialSignInState,
      currentUser: initialCurrentUser,
      authChecker: initialAuthCheckerState,
      dialog: initialDialogState,
      layout: initialLayoutState,
      articleSearch: initialArticleSearchState,
      emailVerification: initialEmailVerificationState,
    };
  });

  describe("recordifyAppState function", () => {
    let result: AppState;

    beforeEach(() => {
      result = recordifyAppState(rawAppState);
    });

    it("should return routing attribute itself", () => {
      expect(result.routing).toEqual(mockRouting);
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
      expect(result.currentUser.toJS()).toEqual(CURRENT_USER_INITIAL_STATE.toJS());
    });

    it("should return recordified authChecker state", () => {
      expect(result.authChecker.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with AUTH_CHECKER_INITIAL_STATE", () => {
      expect(result.authChecker.toJS()).toEqual(AUTH_CHECKER_INITIAL_STATE.toJS());
    });

    it("should return recordified dialog state", () => {
      expect(result.dialog.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with DIALOG_INITIAL_STATE", () => {
      expect(result.dialog.toJS()).toEqual(DIALOG_INITIAL_STATE.toJS());
    });

    it("should return recordified layout state", () => {
      expect(result.layout.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with LAYOUT_INITIAL_STATE", () => {
      expect(result.layout.toJS()).toEqual(LAYOUT_INITIAL_STATE.toJS());
    });

    it("should return recordified articleSearch state", () => {
      expect(result.articleSearch.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with ARTICLE_SEARCH_INITIAL_STATE", () => {
      expect(result.articleSearch.toJS()).toEqual(ARTICLE_SEARCH_INITIAL_STATE.toJS());
    });

    it("should return recordified emailVerification state", () => {
      expect(result.emailVerification.toString().slice(0, 6)).toContain("Record");
    });

    it("should return same value with EMAIL_VERIFICATION_INITIAL_STATE", () => {
      expect(result.emailVerification.toJS()).toEqual(EMAIL_VERIFICATION_INITIAL_STATE.toJS());
    });
  });
});
