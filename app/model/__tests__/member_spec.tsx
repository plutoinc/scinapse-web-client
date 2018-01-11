import { initialMember, IMember, recordifyMember } from "../member";
import { initialMemberOAuth, MemberOAuthFactory } from "../oauth";
import { RAW } from "../../__mocks__";
import { WalletFactory } from "../wallet";

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
      const mockEmailVerified = false;
      const mockOauth = initialMemberOAuth;

      beforeEach(() => {
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
          emailVerified: mockEmailVerified,
          oauth: mockOauth,
        };
      });

      it("should return recoridfied state", () => {
        expect(recordifyMember(mockMember).toString()).toContain("Record");
      });

      it("should return recordifed wallet", () => {
        expect(recordifyMember(mockMember).wallet.toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(recordifyMember(mockMember).toJS()).toEqual(mockMember);
      });

      it("should return same id with params", () => {
        expect(recordifyMember(mockMember).id).toEqual(mockId);
      });

      it("should return same email value with params", () => {
        expect(recordifyMember(mockMember).email).toEqual(mockEmail);
      });

      it("should return same name value with params", () => {
        expect(recordifyMember(mockMember).name).toEqual(mockName);
      });

      it("should return same profileImage with params", () => {
        expect(recordifyMember(mockMember).profileImage).toEqual(mockProfileImage);
      });

      it("should return same institution with params", () => {
        expect(recordifyMember(mockMember).affiliation).toEqual(mockInstitution);
      });

      it("should return same profileImage with params", () => {
        expect(recordifyMember(mockMember).major).toEqual(mockMajor);
      });

      it("should return same reputation with params", () => {
        expect(recordifyMember(mockMember).reputation).toEqual(mockReputation);
      });

      it("should return recorded wallet with params", () => {
        expect(recordifyMember(mockMember).wallet).toEqual(WalletFactory(mockWallet));
      });

      it("should return same articleCount with params", () => {
        expect(recordifyMember(mockMember).articleCount).toEqual(mockArticleCount);
      });

      it("should return same reviewCount with params", () => {
        expect(recordifyMember(mockMember).reviewCount).toEqual(mockReviewCount);
      });

      it("should return same commentCount with params", () => {
        expect(recordifyMember(mockMember).commentCount).toEqual(mockCommentCount);
      });

      it("should return same emailVerified with params", () => {
        expect(recordifyMember(mockMember).emailVerified).toEqual(mockEmailVerified);
      });

      it("should return same oauth with params", () => {
        expect(recordifyMember(mockMember).oauth).toEqual(MemberOAuthFactory(mockOauth));
      });
    });
  });
});
