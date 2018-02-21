import { MemberOAuthFactory, initialMemberOAuth, MemberOAuth } from "../oauth";
import { OAUTH_VENDOR } from "../../api/types/auth";

describe("MemberOAuth record model", () => {
  let mockMemberOAuth: MemberOAuth;

  describe("MemberOAuthStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(MemberOAuthFactory().toString()).toContain("Record");
      });

      it("should return same value with initial state", () => {
        expect(MemberOAuthFactory().toJS()).toEqual(initialMemberOAuth);
      });
    });

    describe("when there are params", () => {
      const mockConnected = false;
      const mockOAuthId = "23";
      const mockUserData = {};
      const mockUuid = "23323";
      const mockVendor: OAUTH_VENDOR = "GOOGLE";

      beforeEach(() => {
        mockMemberOAuth = {
          connected: mockConnected,
          oauthId: mockOAuthId,
          userData: mockUserData,
          uuid: mockUuid,
          vendor: mockVendor,
        };
      });

      it("should return recoridfied state", () => {
        expect(MemberOAuthFactory(mockMemberOAuth).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(MemberOAuthFactory(mockMemberOAuth).toJS()).toEqual(mockMemberOAuth);
      });

      it("should return same connected with params", () => {
        expect(MemberOAuthFactory(mockMemberOAuth).connected).toEqual(mockConnected);
      });

      it("should return same oauthId value with params", () => {
        expect(MemberOAuthFactory(mockMemberOAuth).oauthId).toEqual(mockOAuthId);
      });

      it("should return same userData value with params", () => {
        expect(MemberOAuthFactory(mockMemberOAuth).userData).toEqual(mockUserData);
      });

      it("should return same uuid value with params", () => {
        expect(MemberOAuthFactory(mockMemberOAuth).uuid).toEqual(mockUuid);
      });

      it("should return same vendor value with params", () => {
        expect(MemberOAuthFactory(mockMemberOAuth).vendor).toEqual(mockVendor);
      });
    });
  });
});
