jest.unmock("../actions");
jest.mock("../../../../api/auth");

import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";

describe("myPage actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeProfileImageInput action", () => {
    it("should return MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT action with profileImage", () => {
      const mockProfileImage = "test.img";

      store.dispatch(Actions.changeProfileImageInput(mockProfileImage));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT,
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
        type: ACTION_TYPES.MY_PAGE_CHANGE_INSTITUTION_INPUT,
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
        type: ACTION_TYPES.MY_PAGE_CHANGE_MAJOR_INPUT,
        payload: {
          major: mockMajor,
        },
      });
    });
  });
});
