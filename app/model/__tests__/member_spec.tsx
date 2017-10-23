import { initialMember, IMember, recordifyMember } from "../member";
import { RAW } from "../../__mocks__";

describe("Member record model", () => {
  let mockMember: IMember;

  describe("recordifyMember", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          recordifyMember()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(recordifyMember().toJS()).toEqual(initialMember);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        const mockId = 12345;
        const mockEmail = "mockEmail@pluto.network";
        const mockName = "mockFullName";
        const mockProfileImage = "www.nc.com";
        const mockInstitution = "Postech";
        const mockMajor = "CITE";
        const mockWallet = RAW.WALLET;
        const mockReputation = 34;

        mockMember = {
          id: mockId,
          email: mockEmail,
          name: mockName,
          profileImage: mockProfileImage,
          institution: mockInstitution,
          major: mockMajor,
          wallet: mockWallet,
          reputation: mockReputation,
        };
      });

      it("should return recoridfied state", () => {
        expect(
          recordifyMember(mockMember)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed wallet", () => {
        expect(
          recordifyMember(mockMember)
            .wallet.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with params value", () => {
        expect(recordifyMember(mockMember).toJS()).toEqual(mockMember);
      });
    });
  });
});
