jest.unmock("../formatNumber");

import formatNumber from "../formatNumber";

describe("FormatNumber helper", () => {
  describe("when rawNumber < 1000", () => {
    it("should return the number itself with string type", () => {
      expect(formatNumber(300)).toEqual("300");
    });
  });

  describe("when 1000 <= rawNumber < 10000", () => {
    it("should return the number itself with string type", () => {
      expect(formatNumber(1500)).toEqual("1,500");
    });
  });

  describe("when 10000 <= rawNumber < 100000", () => {
    it("should return the number itself with string type", () => {
      expect(formatNumber(15333)).toEqual("15.3k");
    });
  });

  describe("when 100000 <= rawNumber < 1000000", () => {
    it("should return the number itself with string type", () => {
      expect(formatNumber(153333)).toEqual("153k");
    });
  });

  describe("when 1000000 <= rawNumber < 10000000", () => {
    it("should return the number itself with string type", () => {
      expect(formatNumber(1533333)).toEqual("1.5m");
    });
  });

  describe("when 10000000 <= rawNumber < 100000000", () => {
    it("should return the number itself with string type", () => {
      expect(formatNumber(15333333)).toEqual("15.3m");
    });
  });
});
