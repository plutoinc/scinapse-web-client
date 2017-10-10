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
        mockMember = {
          email: "mockEmail@pluto.network",
          name: "mockFullName",
          id: 12345,
          wallet: RAW.WALLET,
          reputation: 34,
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
