jest.mock("../../../api/auth");
jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { recordify } from "typed-immutable-record";
import { initialMember } from "../../../model/member";

describe("auth actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("signOut action", () => {
    it("should return AUTH_SUCCEEDED_TO_SIGN_OUT action", async () => {
      window.confirm = jest.fn(() => true);
      await store.dispatch(Actions.signOut());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT,
      });
    });
  });

  describe("checkLoggedIn action", () => {
    it("should return AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN action", async () => {
      await store.dispatch(Actions.checkLoggedIn());
      const actions = store.getActions();
      const mockRecordifiedUser = recordify(initialMember);

      expect(JSON.stringify(actions[0])).toEqual(
        JSON.stringify({
          type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
          payload: {
            user: mockRecordifiedUser,
            loggedIn: true,
            oauthLoggedIn: false,
          },
        }),
      );
    });
  });
});
