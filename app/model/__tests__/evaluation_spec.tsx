import { initialEvaluation, IEvaluation, recordifyEvaluation } from "../evaluation";
import { RAW } from "../../__mocks__";

describe("Evaluation record model", () => {
  let mockEvaluation: IEvaluation;

  describe("recordifyEvaluation", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          recordifyEvaluation()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(recordifyEvaluation().toJS()).toEqual(initialEvaluation);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockEvaluation = RAW.EVALUATION;
      });

      it("should return recoridfied state", () => {
        expect(
          recordifyEvaluation(mockEvaluation)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed createdBy", () => {
        expect(
          recordifyEvaluation(mockEvaluation)
            .createdBy.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      // TODO : Comments List<Record> Check

      it("should return recordifed point", () => {
        expect(
          recordifyEvaluation(mockEvaluation)
            .point.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });
    });
  });
});
