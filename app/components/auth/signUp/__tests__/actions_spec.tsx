jest.unmock("../actions");
jest.mock("../../../../api/auth");

import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { makeFormErrorMessage, removeFormErrorMessage } from "../actions";
import { SIGN_UP_ON_FOCUS_TYPE } from "../records";
import { ICreateNewAccountParams } from "../../../../api/auth";

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

  describe("checkValidEmailInput action", () => {
    it("should return removeFormErrorMessage action with email type", () => {
      const mockValidEmail = "tylor@pluto.network";

      store.dispatch(Actions.checkValidEmailInput(mockValidEmail));

      const actions = store.getActions();

      expect(actions[0]).toEqual(removeFormErrorMessage("email"));
    });

    it("should return makeFormErrorMessage action with email type and errorMessage payload", () => {
      const mockInvalidEmail = "dsfjfdssdk";
      const mockErrorMessage = "Please enter a valid email address";

      store.dispatch(Actions.checkValidEmailInput(mockInvalidEmail));

      const actions = store.getActions();

      expect(actions[0]).toEqual(makeFormErrorMessage("email", mockErrorMessage));
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

  describe("checkValidPasswordInput action", () => {
    it("should return removeFormErrorMessage action with password type", () => {
      const mockValidPassword = "fsud@dfsi2j112";

      store.dispatch(Actions.checkValidPasswordInput(mockValidPassword));

      const actions = store.getActions();

      expect(actions[0]).toEqual(removeFormErrorMessage("password"));
    });

    it("should return makeFormErrorMessage action with password type and errorMessage payload", () => {
      const mockInvalidPassword = "";
      const mockErrorMessage = "Please enter password";

      store.dispatch(Actions.checkValidPasswordInput(mockInvalidPassword));

      const actions = store.getActions();

      expect(actions[0]).toEqual(makeFormErrorMessage("password", mockErrorMessage));
    });
  });

  describe("changeRepeatPasswordInput action", () => {
    it("should return SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT action with password payload", () => {
      const mockPassword = "tylorshin";
      store.dispatch(Actions.changeAffiliationInput(mockPassword));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT,
        payload: {
          repeatPassword: mockPassword,
        },
      });
    });
  });

  describe("checkValidRepeatPasswordInput action", () => {
    it("should return removeFormErrorMessage action with repeatPassword type", () => {
      const mockValidAffiliation = "postech";

      store.dispatch(Actions.checkValidAffiliationInput(mockValidAffiliation));

      const actions = store.getActions();

      expect(actions[0]).toEqual(removeFormErrorMessage("repeatPassword"));
    });

    it("should return makeFormErrorMessage action with repeatPassword type and errorMessage payload", () => {
      const mockInValidAffiliation = "";
      const mockErrorMessage = "Please enter affiliation";

      store.dispatch(Actions.checkValidAffiliationInput(mockInValidAffiliation));

      const actions = store.getActions();

      expect(actions[0]).toEqual(makeFormErrorMessage("repeatPassword", mockErrorMessage));
    });
  });

  describe("makeFormErrorMessage action", () => {
    it("should return SIGN_UP_FORM_ERROR action with type and errorMessage payload", () => {
      const mockType = "name";
      const mockErrorMessage = "name should not be under 2 character";
      store.dispatch(Actions.makeFormErrorMessage(mockType, mockErrorMessage));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: mockType,
          errorMessage: mockErrorMessage,
        },
      });
    });
  });

  describe("removeFormErrorMessage action", () => {
    it("should return SIGN_UP_REMOVE_FORM_ERROR action with type payload", () => {
      const mockType = "name";

      store.dispatch(Actions.removeFormErrorMessage(mockType));

      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
        payload: {
          type: mockType,
        },
      });
    });
  });

  describe("onFocusInput action", () => {
    it("should return SIGN_UP_ON_FOCUS_INPUT action with type payload", () => {
      const mockOnFocusType = SIGN_UP_ON_FOCUS_TYPE.EMAIL;
      store.dispatch(Actions.onFocusInput(mockOnFocusType));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_ON_FOCUS_INPUT,
        payload: {
          type: mockOnFocusType,
        },
      });
    });
  });

  describe("onBlurInput action", () => {
    it("should return SIGN_UP_ON_BLUR_INPUT action", () => {
      store.dispatch(Actions.onBlurInput());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_ON_BLUR_INPUT,
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
          password: "tylorshin",
          affiliation: "tylorshin",
          name: "test",
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
          password: "tylorshin",
          affiliation: "tylorshin",
          name: "test",
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
          password: "tylorshin",
          affiliation: "tylorshin",
          name: "test",
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
