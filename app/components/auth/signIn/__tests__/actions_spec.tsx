jest.unmock("../actions");
jest.mock("../../../../api/auth");

import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";

describe("sign in actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeEmailInput action", () => {
    it("should return SIGN_IN_CHANGE_EMAIL_INPUT action with email payload", () => {
      const mockEmail = "tylor@pluto.network";
      store.dispatch(Actions.changeEmailInput(mockEmail));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT,
        payload: {
          email: mockEmail
        }
      });
    });
  });

  describe("changePasswordInput action", () => {
    it("should return SIGN_IN_CHANGE_PASSWORD_INPUT action with password payload", () => {
      const mockPassword = "tylorshin";
      store.dispatch(Actions.changePasswordInput(mockPassword));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT,
        payload: {
          password: mockPassword
        }
      });
    });
  });

  describe("signIn action", () => {
    describe("when success", () => {
      it("should return SIGN_IN_START_TO_SIGN_IN", async () => {
        const mockParams = {
          email: "tylor@pluto.network",
          password: "tylorshin"
        };

        await store.dispatch(Actions.signIn(mockParams));
        const actions = await store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN
        });
      });

      it("should return SIGN_IN_FAILED_TO_SIGN_IN", async () => {
        const mockParams = {
          email: "tylor@pluto.network",
          password: "tylorshin"
        };

        await store.dispatch(Actions.signIn(mockParams));
        const actions = await store.getActions();
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN
        });
      });
    });

    describe("when failed", () => {
      it("should return SIGN_IN_FORM_ERROR", async () => {
        const mockParams = {
          email: "fakeError",
          password: "tylorshin"
        };

        await store.dispatch(Actions.signIn(mockParams));
        const actions = await store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.SIGN_IN_FORM_ERROR
        });
      });

      it("should return SIGN_IN_FAILED_TO_SIGN_IN", async () => {
        const mockParams = {
          email: "fakeError@test.com",
          password: "tylorshin"
        };

        await store.dispatch(Actions.signIn(mockParams));
        const actions = await store.getActions();
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN
        });
      });
    });
  });
});
