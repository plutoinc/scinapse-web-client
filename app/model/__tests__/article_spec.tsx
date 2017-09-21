import { recordifyArticle, initialArticle, IArticle } from "../article";
import { RAW } from "../../__mocks__";

describe("Article model", () => {
  let mockArticle: IArticle;

  describe("recordifyArticle function", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          recordifyArticle()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(recordifyArticle().toJS()).toEqual(initialArticle);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockArticle = RAW.ARTICLE;
      });

      it("should return recoridfied state", () => {
        expect(
          recordifyArticle(mockArticle)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed createdBy", () => {
        expect(
          recordifyArticle(mockArticle)
            .createdBy.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed point", () => {
        expect(
          recordifyArticle(mockArticle)
            .point.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });
    });
  });
});
