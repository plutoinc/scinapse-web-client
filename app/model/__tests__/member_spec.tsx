import { initialMember, IMember, recordifyMember } from "../member";
import { initialMemberOAuth } from "../oauth";
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
        const mockArticleCount = 3;
        const mockReviewCount = 2;
        const mockCommentCount = 4;
        const mockMemberOAuth = initialMemberOAuth;

        mockMember = {
          id: mockId,
          email: mockEmail,
          name: mockName,
          profileImage: mockProfileImage,
          affiliation: mockInstitution,
          major: mockMajor,
          wallet: mockWallet,
          reputation: mockReputation,
          articleCount: mockArticleCount,
          reviewCount: mockReviewCount,
          commentCount: mockCommentCount,
          emailVerified: false,
          oauth: mockMemberOAuth,
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
