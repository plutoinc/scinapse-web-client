jest.unmock("../actions");
jest.mock("../../../../api/auth");

import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { ICreateNewAccountParams } from "../actions";

describe("sign up actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeEmailInput action", () => {
    it("should return SIGN_UP_CHANGE_EMAIL_INPUT action with email payload", () => {
      const mockEmail = "tylor@pluto.network";
      store.dispatch(Actions.changeEmailInput(mockEmail));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
        payload: {
          email: mockEmail,
        },
      });
    });
  });

  describe("changePasswordInput action", () => {
    it("should return SIGN_UP_CHANGE_PASSWORD_INPUT action with password payload", () => {
      const mockPassword = "tylorshin";
      store.dispatch(Actions.changePasswordInput(mockPassword));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
        payload: {
          password: mockPassword,
        },
      });
    });
  });

  describe("changeRepeatPasswordInput action", () => {
    it("should return SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT action with password payload", () => {
      const mockPassword = "tylorshin";
      store.dispatch(Actions.changeRepeatPasswordInput(mockPassword));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT,
        payload: {
          repeatPassword: mockPassword,
        },
      });
    });
  });

  describe("changeNameInput action", () => {
    it("should return SIGN_UP_CHANGE_FULL_NAME_INPUT action with name payload", () => {
      const mockName = "tylorshin";
      store.dispatch(Actions.changeNameInput(mockName));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_CHANGE_NAME_INPUT,
        payload: {
          name: mockName,
        },
      });
    });
  });

  // TODO: Remove skip
  describe.skip("createNewAccount action", () => {
    const mockIsDialog = false;

    describe("when success", () => {
      it("should return SIGN_UP_START_TO_CREATE_ACCOUNT", async () => {
        const mockParams: ICreateNewAccountParams = {
          email: "tylor@pluto.network",
          name: "tylorshin",
          password: "tylorshin",
          repeatPassword: "tylorshin",
        };

        await store.dispatch(Actions.createNewAccount(mockParams, mockIsDialog));
        const actions = await store.getActions();
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
        });
      });

      it("should return SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT", async () => {
        const mockParams: ICreateNewAccountParams = {
          email: "tylor@pluto.network",
          name: "tylorshin",
          password: "tylorshin",
          repeatPassword: "tylorshin",
        };

        await store.dispatch(Actions.createNewAccount(mockParams, mockIsDialog));
        const actions = await store.getActions();
        expect(actions[2]).toEqual({
          type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
        });
      });
    });

    describe("when failed", () => {
      it("should return SIGN_UP_START_TO_CREATE_ACCOUNT", async () => {
        const mockParams: ICreateNewAccountParams = {
          email: "tylor@pluto.network",
          name: "fakeError",
          password: "tylorshin",
          repeatPassword: "tylorshin",
        };

        await store.dispatch(Actions.createNewAccount(mockParams, mockIsDialog));
        const actions = await store.getActions();
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
        });
      });
    });
  });
});
