jest.unmock("../aggregation");

import { List } from "immutable";
import { RAW } from "../../__mocks__";
import { AggregationFactory, GetAggregationRawResult, AggregationDataRecord } from "../aggregation";

describe("Filter Aggregation model", () => {
  describe("AggregationFactory function", () => {
    let result: AggregationDataRecord;

    beforeEach(() => {
      const rawAggregation: GetAggregationRawResult = RAW.AGGREGATION_RESPONSE.data;

      const fosList = rawAggregation.fos_list.map(fos => {
        return { ...fos, ...{ isSelected: false } };
      });

      const journals = rawAggregation.journals.map(journal => {
        return { ...journal, ...{ isSelected: false } };
      });

      const mockAggregationData = {
        journals,
        fosList,
        impactFactors: rawAggregation.impact_factors,
        years: rawAggregation.years,
      };

      result = AggregationFactory(mockAggregationData) as AggregationDataRecord;
    });

    it("should return recordified aggregationData", () => {
      expect(result.toString().slice(0, 6)).toEqual("Record");
    });

    it("should return Listified FOS List", () => {
      expect(List.isList(result.fosList)).toBeTruthy();
    });

    it("should return Listified journal List", () => {
      expect(List.isList(result.journals)).toBeTruthy();
    });

    it("should return Listified impactFactors List", () => {
      expect(List.isList(result.impactFactors)).toBeTruthy();
    });

    it("should return Listified years List", () => {
      expect(List.isList(result.years)).toBeTruthy();
    });

    it("should return recordified FOS", () => {
      expect(
        result.fosList
          .get(0)
          .toString()
          .slice(0, 6),
      ).toEqual("Record");
    });

    it("should return recordified journal", () => {
      expect(
        result.journals
          .get(0)
          .toString()
          .slice(0, 6),
      ).toEqual("Record");
    });

    it("should return recordified impactFactor", () => {
      expect(
        result.impactFactors
          .get(0)
          .toString()
          .slice(0, 6),
      ).toEqual("Record");
    });

    it("should return recordified year", () => {
      expect(
        result.years
          .get(0)
          .toString()
          .slice(0, 6),
      ).toEqual("Record");
    });
  });
});
