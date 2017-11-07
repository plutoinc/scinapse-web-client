import { ReviewPointFactory, initialReviewPoint, IReviewPoint } from "../reviewPoint";
import { RAW } from "../../__mocks__";

describe("ReviewPoint record model", () => {
  let mockReviewPoint: IReviewPoint;

  describe("ReviewPointStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          ReviewPointFactory()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(ReviewPointFactory().toJS()).toEqual(initialReviewPoint);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockReviewPoint = RAW.REVIEW_POINT;
      });

      it("should return recoridfied state", () => {
        expect(
          ReviewPointFactory(mockReviewPoint)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with params value", () => {
        expect(ReviewPointFactory(mockReviewPoint).toJS()).toEqual(mockReviewPoint);
      });
    });
  });
});
