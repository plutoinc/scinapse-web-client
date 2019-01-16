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

export interface RawAggregation {
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
