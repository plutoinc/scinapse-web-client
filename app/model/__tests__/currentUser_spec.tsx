import { CurrentUserFactory, CURRENT_USER_INITIAL_STATE, ICurrentUser } from "../currentUser";

describe("currentUser model", () => {
  describe("CurrentUserStateFactory function", () => {
    it("should return initial state when there is no param", () => {
      console.log("dfskfdkskfds");
      console.log(CurrentUserFactory());

      expect(CurrentUserFactory()).toEqual(CURRENT_USER_INITIAL_STATE);
    });

    it("should return recordified state when there is no param", () => {
      expect(CurrentUserFactory().toString()).toContain("Record");
    });

    describe("when there are params", () => {
      let mockUserObject: ICurrentUser;

      const mockEmail = "tylor@pluto.network";
      const mockMemberId = 123;
      const mockNickName = "TylorShin";
      const mockPassword = "mockPassword";

      beforeEach(() => {
        mockUserObject = {
          email: mockEmail,
          memberId: mockMemberId,
          nickName: mockNickName,
          password: mockPassword,
        };
      });

      it("should return recordified state", () => {
        expect(CurrentUserFactory(mockUserObject).toString()).toContain("Record");
      });

      it("should return same email value with params", () => {
        expect(CurrentUserFactory(mockUserObject).email).toEqual(mockEmail);
      });

      it("should return same memberId with params", () => {
        expect(CurrentUserFactory(mockUserObject).memberId).toEqual(mockMemberId);
      });

      it("should return number type of memberId", () => {
        expect(typeof CurrentUserFactory(mockUserObject).memberId).toEqual("number");
      });

      it("should return same nickName with params", () => {
        expect(CurrentUserFactory(mockUserObject).nickName).toEqual(mockNickName);
      });

      it("should return same password with params", () => {
        expect(CurrentUserFactory(mockUserObject).password).toEqual(mockPassword);
      });
    });
  });
});
