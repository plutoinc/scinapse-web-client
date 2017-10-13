jest.unmock("../records");

import { MyPageStateFactory, IMyPageStateRecord, MY_PAGE_INITIAL_STATE, MY_PAGE_CATEGORY_TYPE } from "../records";

describe("MyPage records", () => {
  describe("MyPageStateFactory function", () => {
    let state: IMyPageStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = MyPageStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(MY_PAGE_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockCategory = MY_PAGE_CATEGORY_TYPE.WALLET;
      const mockProfileImageInput = "https://test.com";
      const mockInstitutionInput = "test Institution";
      const mockMajorInput = "Cite";

      beforeEach(() => {
        const jsState = {
          isLoading: false,
          hasError: false,
          category: mockCategory,
          profileImageInput: mockProfileImageInput,
          institutionInput: mockInstitutionInput,
          majorInput: mockMajorInput,
        };

        state = MyPageStateFactory(jsState);
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

      it("should have param's email value", () => {
        expect(state.category).toEqual(mockCategory);
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
