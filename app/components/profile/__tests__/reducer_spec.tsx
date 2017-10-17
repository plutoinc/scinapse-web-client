jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IProfileStateRecord, PROFILE_INITIAL_STATE } from "../records";

function reduceState(action: any, state: IProfileStateRecord = PROFILE_INITIAL_STATE) {
  return reducer(state, action);
}

describe("MyPage reducer", () => {
  let mockAction: any;
  let state: IProfileStateRecord;

  describe("when receive MY_PAGE_CHANGE_PROFILE_IMAGE_INPUT", () => {
    it("should set category following profileImage payload", () => {
      const mockProfileImage = "test.img";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_PROFILE_IMAGE_INPUT,
        payload: {
          profileImage: mockProfileImage,
        },
      };

      state = reduceState(mockAction);

      expect(state.profileImageInput).toEqual(mockProfileImage);
    });
  });

  describe("when receive MY_PAGE_CHANGE_INSTITUTION_INPUT", () => {
    it("should set category following institution payload", () => {
      const mockInstitution = "postech";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_INSTITUTION_INPUT,
        payload: {
          institution: mockInstitution,
        },
      };

      state = reduceState(mockAction);

      expect(state.institutionInput).toEqual(mockInstitution);
    });
  });

  describe("when receive MY_PAGE_CHANGE_MAJOR_INPUT", () => {
    it("should set category following major payload", () => {
      const mockMajor = "Postech";

      mockAction = {
        type: ACTION_TYPES.PROFILE_CHANGE_MAJOR_INPUT,
        payload: {
          major: mockMajor,
        },
      };

      state = reduceState(mockAction);

      expect(state.majorInput).toEqual(mockMajor);
    });
  });
});
