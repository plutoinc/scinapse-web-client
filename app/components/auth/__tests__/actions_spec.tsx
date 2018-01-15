jest.mock("../../../api/auth");
jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { recordify } from "typed-immutable-record";
import { initialMember } from "../../../model/member";

describe("auth actions", () => {
  let store: any;
  let tempWindowConfirmFunc: any;

  beforeAll(() => {
    tempWindowConfirmFunc = window.confirm;
  });

  afterAll(() => {
    window.confirm = tempWindowConfirmFunc;
  });

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
    it("should return AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN type action", async () => {
      await store.dispatch(Actions.checkLoggedIn());
      const actions = store.getActions();

      expect(actions[0].type).toEqual(ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN);
    });

    it("should return recordifiedUser payload action", async () => {
      await store.dispatch(Actions.checkLoggedIn());
      const actions = store.getActions();
      const mockRecordifiedUser = recordify(initialMember);

      expect(JSON.stringify(actions[0].payload.user)).toEqual(JSON.stringify(mockRecordifiedUser));
    });

    it("should return loggedIn payload action", async () => {
      await store.dispatch(Actions.checkLoggedIn());
      const actions = store.getActions();
      const mockLoggedIn = true;

      expect(actions[0].payload.loggedIn).toEqual(mockLoggedIn);
    });

    it("should return loggedIn payload action", async () => {
      await store.dispatch(Actions.checkLoggedIn());
      const actions = store.getActions();
      const mockOauthLoggedIn = false;

      expect(actions[0].payload.oauthLoggedIn).toEqual(mockOauthLoggedIn);
    });
  });
});
