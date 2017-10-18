jest.unmock("../actions");
jest.mock("../../../api/profile");
jest.mock("../../../helpers/makePlutoToastAction", () => {
  return () => {};
});

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { initialCurrentUser, ICurrentUserRecord, recordifyCurrentUser } from "../../../model/currentUser";

describe("myPage actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("syncCurrentUserWithProfileUser action", () => {
    it("should return PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER action with currentUser payload", () => {
      const mockCurrentUser: ICurrentUserRecord = recordifyCurrentUser(initialCurrentUser);

      store.dispatch(Actions.syncCurrentUserWithProfileUser(mockCurrentUser));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_SYNC_CURRENT_USER_WITH_PROFILE_USER,
        payload: {
          currentUser: mockCurrentUser,
        },
      });
    });
  });

  describe("getUserProfile action", () => {
    it("should return PROFILE_START_TO_GET_USER_PROFILE action with userId", () => {
      const mockUserId = "13";

      store.dispatch(Actions.getUserProfile(mockUserId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_START_TO_GET_USER_PROFILE,
      });
      // TODO: Success Case & Fail Case
    });
  });

  describe("syncSettingInputWithCurrentUser action", () => {
    it("should return PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER action with profileImage and institution and major payload", () => {
      const mockProfileImage = "test.img";
      const mockInstitution = "Postech";
      const mockMajor = "CITE";

      store.dispatch(Actions.syncSettingInputWithCurrentUser(mockProfileImage, mockInstitution, mockMajor));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_SYNC_SETTING_INPUT_WITH_CURRENT_USER,
        payload: {
          profileImage: mockProfileImage,
          institution: mockInstitution,
          major: mockMajor,
        },
      });
    });
  });

  describe("changeProfileImageInput action", () => {
    it("should return MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT action with profileImage", () => {
      const mockProfileImage = "test.img";

      store.dispatch(Actions.changeProfileImageInput(mockProfileImage));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_CHANGE_PROFILE_IMAGE_INPUT,
        payload: {
          profileImage: mockProfileImage,
        },
      });
    });
  });

  describe("changeInstitutionInput action", () => {
    it("should return MY_PAGE_CHANGE_INSTITUTION_INPUT action with institution", () => {
      const mockInstitution = "Postech";

      store.dispatch(Actions.changeInstitutionInput(mockInstitution));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_CHANGE_INSTITUTION_INPUT,
        payload: {
          institution: mockInstitution,
        },
      });
    });
  });

  describe("changeMajorInput action", () => {
    it("should return MY_PAGE_CHANGE_MAJOR_INPUT action with major", () => {
      const mockMajor = "CITE";

      store.dispatch(Actions.changeMajorInput(mockMajor));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT,
        payload: {
          major: mockMajor,
        },
      });
    });
  });
});
