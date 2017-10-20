jest.unmock("../records");

import { List } from "immutable";
import { ProfileStateFactory, IProfileStateRecord, PROFILE_INITIAL_STATE, IProfileState } from "../records";
import { initialCurrentUser, recordifyCurrentUser } from "../../../model/currentUser";

describe("MyPage records", () => {
  describe("MyPageStateFactory function", () => {
    let state: IProfileStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = ProfileStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(PROFILE_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockProfileImageInput = "https://test.com";
      const mockInstitutionInput = "test Institution";
      const mockMajorInput = "Cite";
      const mockUserProfile = recordifyCurrentUser(initialCurrentUser);

      beforeEach(() => {
        const jsState: IProfileState = {
          isLoading: false,
          hasError: false,
          fetchingContentLoading: false,
          fetchingContentError: false,
          profileImageInput: mockProfileImageInput,
          institutionInput: mockInstitutionInput,
          majorInput: mockMajorInput,
          userProfile: mockUserProfile,
          articlesToShow: List(),
          isEnd: false,
          page: 0,
        };

        state = ProfileStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeFalsy();
      });

      it("should have param's profileImageInput value", () => {
        expect(state.profileImageInput).toEqual(mockProfileImageInput);
      });

      it("should have param's institutionInput value", () => {
        expect(state.institutionInput).toEqual(mockInstitutionInput);
      });

      it("should have param's majorInput value", () => {
        expect(state.majorInput).toEqual(mockMajorInput);
      });

      it("should have param's userProfile value", () => {
        expect(state.userProfile).toEqual(mockUserProfile);
      });
    });
  });
});
