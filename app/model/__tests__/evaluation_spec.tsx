import { initialEvaluation, IEvaluation, recordifyEvaluation } from "../evaluation";
import { RAW } from "../../__mocks__";
import { List } from "immutable";

describe("Evaluation record model", () => {
  let mockEvaluation: IEvaluation = RAW.EVALUATION;

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

      it("should return recordifed comments to be record", () => {
        expect(List.isList(recordifyEvaluation(mockEvaluation).comments)).toBeTruthy();
      });

      recordifyEvaluation(mockEvaluation).comments.forEach(comment => {
        it("should return one of comments to be record", () => {
          expect(comment.toString().slice(0, 6)).toEqual("Record");
        });
      });

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
