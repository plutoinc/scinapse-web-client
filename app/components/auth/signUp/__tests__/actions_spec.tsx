jest.mock("../../../../api/auth");
jest.mock("normalize.css", () => {});
jest.unmock("../actions");

import { push } from "react-router-redux";
import { recordify } from "typed-immutable-record";
import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP, ISignUpStateRecord, SIGN_UP_INITIAL_STATE } from "../records";
import { closeDialog } from "../../../dialog/actions";
import { OAUTH_VENDOR } from "../../../../api/types/auth";
import { recordifyMember, initialMember } from "../../../../model/member";

describe("signUp actions", () => {
  let store: any;
  let tempWindowLocationReplaceFunc: any;
  let tempWindowAlertFunc: any;

  beforeAll(() => {
    tempWindowLocationReplaceFunc = window.location.replace;
    tempWindowAlertFunc = window.alert;
  });

  afterAll(() => {
    window.location.replace = tempWindowLocationReplaceFunc;
    window.alert = tempWindowAlertFunc;
  });

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

      expect(actions[0]).toEqual(Actions.removeFormErrorMessage("email"));
    });

    it("should return makeFormErrorMessage action with email type and errorMessage payload", () => {
      const mockInvalidEmail = "dsfjfdssdk";
      const mockErrorMessage = "Please enter a valid email address";

      store.dispatch(Actions.checkValidEmailInput(mockInvalidEmail));

      const actions = store.getActions();
      expect(actions[0]).toEqual(Actions.makeFormErrorMessage("email", mockErrorMessage));
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

      expect(actions[0]).toEqual(Actions.removeFormErrorMessage("password"));
    });

    it("should return makeFormErrorMessage action with password type and errorMessage payload", () => {
      const mockInvalidPassword = "";
      const mockErrorMessage = "Please enter password";

      store.dispatch(Actions.checkValidPasswordInput(mockInvalidPassword));

      const actions = store.getActions();

      expect(actions[0]).toEqual(Actions.makeFormErrorMessage("password", mockErrorMessage));
    });
  });

  describe("changeNameInput action", () => {
    it("should return SIGN_UP_CHANGE_NAME_INPUT action with name payload", () => {
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

  describe("checkValidNameInput action", () => {
    it("should return removeFormErrorMessage action with password type", () => {
      const mockValidName = "fsud@dfsi2j112";

      store.dispatch(Actions.checkValidNameInput(mockValidName));

      const actions = store.getActions();

      expect(actions[0]).toEqual(Actions.removeFormErrorMessage("name"));
    });

    it("should return makeFormErrorMessage action with password type and errorMessage payload", () => {
      const mockInvalidName = "";
      const mockErrorMessage = "Please enter name";

      store.dispatch(Actions.checkValidNameInput(mockInvalidName));

      const actions = store.getActions();

      expect(actions[0]).toEqual(Actions.makeFormErrorMessage("name", mockErrorMessage));
    });
  });

  describe("changeAffiliationInput action", () => {
    it("should return SIGN_UP_CHANGE_AFFILIATION_INPUT action with affiliation payload", () => {
      const mockAffiliation = "tylorshin";
      store.dispatch(Actions.changeAffiliationInput(mockAffiliation));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT,
        payload: {
          affiliation: mockAffiliation,
        },
      });
    });
  });

  describe("checkValidAffiliationInput action", () => {
    it("should return removeFormErrorMessage action with repeatPassword type", () => {
      const mockValidAffiliation = "postech";

      store.dispatch(Actions.checkValidAffiliationInput(mockValidAffiliation));

      const actions = store.getActions();

      expect(actions[0]).toEqual(Actions.removeFormErrorMessage("affiliation"));
    });

    it("should return makeFormErrorMessage action with repeatPassword type and errorMessage payload", () => {
      const mockInValidAffiliation = "";
      const mockErrorMessage = "Please enter affiliation";

      store.dispatch(Actions.checkValidAffiliationInput(mockInValidAffiliation));

      const actions = store.getActions();

      expect(actions[0]).toEqual(Actions.makeFormErrorMessage("affiliation", mockErrorMessage));
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

  describe("changeSignUpStep action", () => {
    it("should return SIGN_UP_CHANGE_SIGN_UP_STEP action with step payload", () => {
      const mockStep = SIGN_UP_STEP.FIRST;
      store.dispatch(Actions.changeSignUpStep(mockStep));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_CHANGE_SIGN_UP_STEP,
        payload: {
          step: mockStep,
        },
      });
    });
  });

  describe("signUpWithEmail action", () => {
    const mockIsDialog = false;

    describe("currentStep is SIGN_UP_STEP.FIRST", () => {
      const currentStep = SIGN_UP_STEP.FIRST;

      it("should return makeFormErrorMessage action with email type and errorMessage payload", () => {
        const mockInValidEmail = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("email", mockInValidEmail);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[0]).toEqual(Actions.makeFormErrorMessage("email", "Please enter a valid email address"));
      });

      it("should return removeFormErrorMessage action with email type", () => {
        const mockValidEmail = "ac@hanmail.net";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("email", mockValidEmail);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[0]).toEqual(Actions.removeFormErrorMessage("email"));
      });

      it("should return makeFormErrorMessage action with password type and errorMessage payload", () => {
        const mockInValidPassword = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("password", mockInValidPassword);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[1]).toEqual(Actions.makeFormErrorMessage("password", "Please enter password"));
      });

      it("should return removeFormErrorMessage action with password type", () => {
        const mockValidPassword = "hjfldkgjgfdkljfgd";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("password", mockValidPassword);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[1]).toEqual(Actions.removeFormErrorMessage("password"));
      });
    });

    describe("currentStep is SIGN_UP_STEP.WITH_EMAIL", () => {
      const currentStep = SIGN_UP_STEP.WITH_EMAIL;

      it("should return makeFormErrorMessage action with email type and errorMessage payload", () => {
        const mockInValidEmail = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("email", mockInValidEmail);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[0]).toEqual(Actions.makeFormErrorMessage("email", "Please enter a valid email address"));
      });

      it("should return removeFormErrorMessage action with email type", () => {
        const mockValidEmail = "ac@hanmail.net";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("email", mockValidEmail);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[0]).toEqual(Actions.removeFormErrorMessage("email"));
      });

      it("should return makeFormErrorMessage action with password type and errorMessage payload", () => {
        const mockInValidPassword = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("password", mockInValidPassword);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[1]).toEqual(Actions.makeFormErrorMessage("password", "Please enter password"));
      });

      it("should return removeFormErrorMessage action with password type", () => {
        const mockValidPassword = "hjfldkgjgfdkljfgd";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("password", mockValidPassword);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[1]).toEqual(Actions.removeFormErrorMessage("password"));
      });

      it("should return makeFormErrorMessage action with name type and errorMessage payload", () => {
        const mockInValidName = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("name", mockInValidName);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[2]).toEqual(Actions.makeFormErrorMessage("name", "Please enter name"));
      });

      it("should return removeFormErrorMessage action with name type", () => {
        const mockValidName = "hjfldkgjgfdkljfgd";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("name", mockValidName);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[2]).toEqual(Actions.removeFormErrorMessage("name"));
      });

      it("should return makeFormErrorMessage action with affiliation type and errorMessage payload", () => {
        const mockInValidAffiliation = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("affiliation", mockInValidAffiliation);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[3]).toEqual(Actions.makeFormErrorMessage("affiliation", "Please enter affiliation"));
      });

      it("should return removeFormErrorMessage action with affiliation type", () => {
        const mockValidAffiliation = "hjfldkgjgfdkljfgd";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("affiliation", mockValidAffiliation);
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
        const actions = store.getActions();
        expect(actions[3]).toEqual(Actions.removeFormErrorMessage("affiliation"));
      });

      describe("When email, password, name, affiliation is valid", () => {
        let mockSignUpState: ISignUpStateRecord;
        const mockValidEmail = "testvalid@email.com";
        const mockValidPassword = "hjfldkgjgfdkljfgd";
        const mockValidName = "hjfldkgjgfdkljfgd";
        const mockValidAffiliation = "hjfldkgjgfdkljfgd";

        beforeEach(() => {
          mockSignUpState = SIGN_UP_INITIAL_STATE.withMutations(state => {
            state
              .set("email", mockValidEmail)
              .set("password", mockValidPassword)
              .set("name", mockValidName)
              .set("affiliation", mockValidAffiliation);
          });
        });

        it("should return SIGN_UP_START_TO_CREATE_ACCOUNT action", async () => {
          await store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
          const actions = store.getActions();

          expect(actions[6]).toEqual({
            type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
          });
        });

        it("should return SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT action", async () => {
          await store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
          const actions = store.getActions();

          expect(actions[7]).toEqual({
            type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
          });
        });

        it("should return SIGN_IN_SUCCEEDED_TO_SIGN_IN action with recordifiedUser, loggedIn, oauthLoggedIn parameter for currentUser State", async () => {
          await store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, mockIsDialog));
          const actions = store.getActions();

          expect(JSON.stringify(actions[8])).toEqual(
            JSON.stringify({
              type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
              payload: {
                user: recordifyMember({
                  ...initialMember,
                  email: mockValidEmail,
                  name: mockValidName,
                  affiliation: mockValidAffiliation,
                }),
                loggedIn: true,
                oauthLoggedIn: false, // Because this method is signUpWithEmail
              },
            }),
          );
        });
      });
    });
    describe("currentStep is SIGN_UP_STEP.FINAL_WITH_EMAIL", () => {
      const currentStep = SIGN_UP_STEP.FINAL_WITH_EMAIL;

      it("should return push action to home page if not dialog", () => {
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE;
        const isDialog = false;
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, isDialog));
        const actions = store.getActions();
        expect(actions[0]).toEqual(push("/"));
      });

      it("should return closeDialog action", () => {
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE;
        const isDialog = true;
        store.dispatch(Actions.signUpWithEmail(currentStep, mockSignUpState, isDialog));
        const actions = store.getActions();
        expect(actions[0]).toEqual(closeDialog());
      });
    });
  });
  describe("signUpWithSocial action", () => {
    const mockVendor: OAUTH_VENDOR = "GOOGLE";
    const mockOauthRedirectPath = "/search?query=text=te";

    describe("currentStep is SIGN_UP_STEP.FIRST", () => {
      const currentStep = SIGN_UP_STEP.FIRST;

      it("should call window.location.replace function with authorizeUri", async () => {
        window.location.replace = jest.fn(() => {});
        await store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath));
        expect(window.location.replace).toHaveBeenCalledWith("");
      });
    });

    describe("currentStep is SIGN_UP_STEP.WITH_SOCIAL", () => {
      const currentStep = SIGN_UP_STEP.WITH_SOCIAL;

      it("should return makeFormErrorMessage action with email type and errorMessage payload", () => {
        const mockInValidEmail = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("email", mockInValidEmail);
        store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState));
        const actions = store.getActions();
        expect(actions[0]).toEqual(Actions.makeFormErrorMessage("email", "Please enter a valid email address"));
      });

      it("should return removeFormErrorMessage action with email type", () => {
        const mockValidEmail = "ac@hanmail.net";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("email", mockValidEmail);
        store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState));
        const actions = store.getActions();
        expect(actions[0]).toEqual(Actions.removeFormErrorMessage("email"));
      });

      it("should return makeFormErrorMessage action with name type and errorMessage payload", () => {
        const mockInValidName = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("name", mockInValidName);
        store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState));
        const actions = store.getActions();
        expect(actions[1]).toEqual(Actions.makeFormErrorMessage("name", "Please enter name"));
      });

      it("should return removeFormErrorMessage action with name type", () => {
        const mockValidName = "hjfldkgjgfdkljfgd";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("name", mockValidName);
        store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState));
        const actions = store.getActions();
        expect(actions[1]).toEqual(Actions.removeFormErrorMessage("name"));
      });

      it("should return makeFormErrorMessage action with affiliation type and errorMessage payload", () => {
        const mockInValidAffiliation = "";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("affiliation", mockInValidAffiliation);
        store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState));
        const actions = store.getActions();
        expect(actions[2]).toEqual(Actions.makeFormErrorMessage("affiliation", "Please enter affiliation"));
      });

      it("should return removeFormErrorMessage action with affiliation type", () => {
        const mockValidAffiliation = "hjfldkgjgfdkljfgd";
        const mockSignUpState: ISignUpStateRecord = SIGN_UP_INITIAL_STATE.set("affiliation", mockValidAffiliation);
        store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState));
        const actions = store.getActions();
        expect(actions[2]).toEqual(Actions.removeFormErrorMessage("affiliation"));
      });

      describe("When email, name, affiliation is valid", () => {
        let mockSignUpState: ISignUpStateRecord;
        const mockValidEmail = "testvalid@email.com";
        const mockValidName = "hjfldkgjgfdkljfgd";
        const mockValidAffiliation = "hjfldkgjgfdkljfgd";

        beforeEach(() => {
          mockSignUpState = SIGN_UP_INITIAL_STATE.withMutations(state => {
            state
              .set("email", mockValidEmail)
              .set("name", mockValidName)
              .set("affiliation", mockValidAffiliation);
          });
        });

        it("should return SIGN_UP_START_TO_CREATE_ACCOUNT action", async () => {
          await store.dispatch(
            Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState),
          );
          const actions = store.getActions();

          expect(actions[5]).toEqual({
            type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
          });
        });

        it("should return SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT action", async () => {
          await store.dispatch(
            Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState),
          );
          const actions = store.getActions();

          expect(actions[6]).toEqual({
            type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
          });
        });

        it("should return push to oauthRedirectPath if it exist", async () => {
          await store.dispatch(
            Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState),
          );
          const actions = store.getActions();

          expect(actions[7]).toEqual(push(mockOauthRedirectPath));
        });

        it("should return push to home page if it doesn't exist", async () => {
          let oAuthRedirectPath = null;
          await store.dispatch(Actions.signUpWithSocial(currentStep, mockVendor, oAuthRedirectPath, mockSignUpState));
          const actions = store.getActions();

          expect(actions[7]).toEqual(push("/"));
        });

        it("should return SIGN_IN_SUCCEEDED_TO_SIGN_IN action with recordifiedUser, loggedIn, oauthLoggedIn parameter for currentUser State", async () => {
          await store.dispatch(
            Actions.signUpWithSocial(currentStep, mockVendor, mockOauthRedirectPath, mockSignUpState),
          );
          const actions = store.getActions();
          expect(JSON.stringify(actions[8])).toEqual(
            JSON.stringify({
              type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
              payload: {
                user: recordifyMember({
                  ...initialMember,
                  email: mockValidEmail,
                  name: mockValidName,
                  affiliation: mockValidAffiliation,
                }),
                loggedIn: true,
                oauthLoggedIn: true, // Because this method is signUpWithEmail
              },
            }),
          );
        });
      });
    });
  });
  describe("getAuthorizeCode action", () => {
    const mockCode = "tjksdlfjfdslkjfdskls";
    const mockVendor: OAUTH_VENDOR = "GOOGLE";

    it("should return SIGN_UP_GET_AUTHORIZE_CODE action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_GET_AUTHORIZE_CODE,
      });
    });

    it("should return SIGN_UP_START_TO_EXCHANGE action", async () => {
      await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor));
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.SIGN_UP_START_TO_EXCHANGE,
      });
    });

    describe("if this oauth is connected", () => {
      const mockConnectedCode = "isConnected";

      it("should return SIGN_UP_FAILED_TO_EXCHANGE ", async () => {
        window.alert = jest.fn(() => {});
        await store.dispatch(Actions.getAuthorizeCode(mockConnectedCode, mockVendor));
        const actions = store.getActions();
        expect(actions[2]).toEqual({
          type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
        });
      });

      it("should return push to /users/sign_in if this oauth is connected", async () => {
        window.alert = jest.fn(() => {});
        await store.dispatch(Actions.getAuthorizeCode(mockConnectedCode, mockVendor));
        const actions = store.getActions();
        expect(actions[3]).toEqual(push("/users/sign_in"));
      });
    });

    describe("if this oauth is not connected", () => {
      it("should return SIGN_UP_SUCCEEDED_TO_EXCHANGE with user & oauth data", async () => {
        await store.dispatch(Actions.getAuthorizeCode(mockCode, mockVendor));
        const actions = store.getActions();

        expect(JSON.stringify(actions[2])).toEqual(
          JSON.stringify({
            type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE,
            payload: {
              vendor: mockVendor,
              email: "",
              name: "",
              oauth: recordify({
                code: mockCode,
                oauthId: "",
                uuid: "",
                vendor: mockVendor,
              }),
            },
          }),
        );
      });
    });
  });

  describe("goBack action", () => {
    it("should return SIGN_UP_GO_BACK", async () => {
      store.dispatch(Actions.goBack());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.SIGN_UP_GO_BACK,
      });
    });
  });
});
