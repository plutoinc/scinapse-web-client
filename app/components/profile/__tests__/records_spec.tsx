jest.unmock("../records");

import { ProfileStateFactory, IProfileStateRecord, PROFILE_INITIAL_STATE } from "../records";

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

      beforeEach(() => {
        const jsState = {
          isLoading: false,
          hasError: false,
          profileImageInput: mockProfileImageInput,
          institutionInput: mockInstitutionInput,
          majorInput: mockMajorInput,
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
    });
  });
});
