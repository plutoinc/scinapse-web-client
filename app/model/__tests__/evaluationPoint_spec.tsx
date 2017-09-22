import { EvaluationPointFactory, initialEvaluationPoint, IEvaluationPoint } from "../evaluationPoint";
import { RAW } from "../../__mocks__";

describe("EvaluationPoint record model", () => {
  let mockEvaluationPoint: IEvaluationPoint;

  describe("EvaluationPointStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          EvaluationPointFactory()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(EvaluationPointFactory().toJS()).toEqual(initialEvaluationPoint);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockEvaluationPoint = RAW.EVALUATION_POINT;
      });

      it("should return recoridfied state", () => {
        expect(
          EvaluationPointFactory(mockEvaluationPoint)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with params value", () => {
        expect(EvaluationPointFactory(mockEvaluationPoint).toJS()).toEqual(mockEvaluationPoint);
      });
    });
  });
});
