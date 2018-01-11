jest.unmock("../currentUser");
jest.unmock("../../model/currentUser");

import { reducer } from "../currentUser";
import { ACTION_TYPES } from "../../actions/actionTypes";
import {
  ICurrentUserRecord,
  CURRENT_USER_INITIAL_STATE,
  recordifyCurrentUser,
  initialCurrentUser,
} from "../../model/currentUser";

function reduceState(action: any, state: ICurrentUserRecord = CURRENT_USER_INITIAL_STATE) {
  return reducer(state, action);
}

describe("currentUser reducer", () => {
  let mockAction: any;
  let state: ICurrentUserRecord;

  describe("when receive SIGN_IN_SUCCEEDED_TO_SIGN_IN", () => {
    const mockCurrentUser = initialCurrentUser;
    const mockLoggedIn = false;
    const mockOAuthLoggedIn = true;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
        payload: {
          user: mockCurrentUser,
          loggedIn: mockLoggedIn,
          oauthLoggedIn: mockOAuthLoggedIn,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set state following payloads", () => {
      expect(JSON.stringify(state)).toEqual(
        JSON.stringify(
          recordifyCurrentUser(mockCurrentUser).withMutations(currentUser => {
            currentUser.set("isLoggedIn", mockLoggedIn).set("oauthLoggedIn", mockOAuthLoggedIn);
          }),
        ),
      );
    });

    it("should set isLoggedIn following payload", () => {
      expect(state.isLoggedIn).toEqual(mockLoggedIn);
    });

    it("should set oauthLoggedIn following payload", () => {
      expect(state.oauthLoggedIn).toEqual(mockOAuthLoggedIn);
    });
  });

  describe("when receive AUTH_SUCCEEDED_TO_SIGN_OUT", () => {
    it("should set state CURRENT_USER_INITIAL_STATE", () => {
      mockAction = {
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
      };

      state = reduceState(mockAction);
      expect(state).toEqual(CURRENT_USER_INITIAL_STATE);
    });
  });

  describe("when receive AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN", () => {
    const mockCurrentUser = initialCurrentUser;
    const mockLoggedIn = false;
    const mockOAuthLoggedIn = true;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
        payload: {
          user: mockCurrentUser,
          loggedIn: mockLoggedIn,
          oauthLoggedIn: mockOAuthLoggedIn,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set state following payloads", () => {
      expect(JSON.stringify(state)).toEqual(
        JSON.stringify(
          recordifyCurrentUser(mockCurrentUser).withMutations(currentUser => {
            currentUser.set("isLoggedIn", mockLoggedIn).set("oauthLoggedIn", mockOAuthLoggedIn);
          }),
        ),
      );
    });

    it("should set isLoggedIn following payload", () => {
      expect(state.isLoggedIn).toEqual(mockLoggedIn);
    });

    it("should set oauthLoggedIn following payload", () => {
      expect(state.oauthLoggedIn).toEqual(mockOAuthLoggedIn);
    });
  });

  describe("when receive EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN", () => {
    it("should set emailVerified to be true", () => {
      mockAction = {
        type: ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN,
      };

      state = reduceState(mockAction);
      expect(state.emailVerified).toBeTruthy();
    });
  });

  describe("when receive except action", () => {
    it("should set state to state", () => {
      mockAction = ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT;

      state = reduceState(mockAction);

      expect(state).toEqual(state);
    });
  });
});
