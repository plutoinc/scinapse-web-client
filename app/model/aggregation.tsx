import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";

interface RawAggregationJournal {
  id: number;
  title: string;
  doc_count: number;
}

interface RawAggregationFos {
  id: number;
  name: string;
  doc_count: number;
}

interface RawYear {
  year: number;
  doc_count: number;
}

interface RawImpactFactor {
  from: number;
  to: number | null;
  doc_count: number;
}

export interface GetAggregationRawResult {
  fos_list: RawAggregationFos[];
  journals: RawAggregationJournal[];
  impact_factors: RawImpactFactor[];
  years: RawYear[];
}

export interface AggregationData {
  fosList: RawAggregationFos[];
  journals: RawAggregationJournal[];
  impactFactors: RawImpactFactor[];
  years: RawYear[];
}

export interface AggregationDataPart {
  fosList: List<AggregationFosRecord>;
  journals: List<AggregationJournalRecord>;
  impactFactors: List<AggregationImpactFactorRecord>;
  years: List<AggregationYearRecord>;
}

export interface AggregationFosRecord extends TypedRecord<AggregationFosRecord>, RawAggregationFos {}
export interface AggregationJournalRecord extends TypedRecord<AggregationJournalRecord>, RawAggregationJournal {}
export interface AggregationYearRecord extends TypedRecord<AggregationYearRecord>, RawYear {}
export interface AggregationImpactFactorRecord extends TypedRecord<AggregationImpactFactorRecord>, RawImpactFactor {}
export interface AggregationDataRecord extends TypedRecord<AggregationDataRecord>, AggregationDataPart {}

export function AggregationFactory(aggregationData: AggregationData | null): AggregationDataRecord {
  if (!aggregationData) {
    return recordify({
      fosList: List(),
      journals: List(),
      impactFactors: List(),
      years: List(),
    });
  } else {
    const fosPart = aggregationData.fosList && aggregationData.fosList.map(fos => recordify(fos));
    const journalsPart = aggregationData.journals && aggregationData.journals.map(journal => recordify(journal));
    const impactFactorsPart =
      aggregationData.impactFactors && aggregationData.impactFactors.map(impactFactor => recordify(impactFactor));
    const yearsPart = aggregationData.years && aggregationData.years.map(year => recordify(year));

    return recordify({
      fosList: List(fosPart) as List<AggregationFosRecord>,
      journals: List(journalsPart) as List<AggregationJournalRecord>,
      impactFactors: List(impactFactorsPart) as List<AggregationImpactFactorRecord>,
      years: List(yearsPart) as List<AggregationYearRecord>,
    });
  }
}
