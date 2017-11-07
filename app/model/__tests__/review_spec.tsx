import { initialReview, IReview, recordifyReview } from "../review";
import { RAW } from "../../__mocks__";

describe("Review record model", () => {
  let mockReview: IReview = RAW.REVIEW;

  describe("recordifyReview", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          recordifyReview()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(recordifyReview().toJS()).toEqual(initialReview);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockReview = RAW.REVIEW;
      });

      it("should return recoridfied state", () => {
        expect(
          recordifyReview(mockReview)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed createdBy", () => {
        expect(
          recordifyReview(mockReview)
            .createdBy.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed point", () => {
        expect(
          recordifyReview(mockReview)
            .point.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });
    });
  });
});
