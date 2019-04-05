interface RawAggregationJournal {
  id: number;
  title: string;
  doc_count: number;
  impact_factor: number;
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

export interface AggregationJournal {
  id: number;
  title: string;
  docCount: number;
  impactFactor: number;
}

export interface AggregationFos {
  id: number;
  name: string;
  level: number;
  docCount: number;
}

interface Year {
  year: number;
  docCount: number;
}

interface ImpactFactor {
  from: number;
  to: number | null;
  docCount: number;
}

export interface RawAggregation {
  fos_list: RawAggregationFos[];
  journals: RawAggregationJournal[];
  impact_factors: RawImpactFactor[];
  year_all: RawYear[] | null;
  year_filtered: RawYear[] | null;
}

export interface AggregationData {
  fosList: AggregationFos[];
  journals: AggregationJournal[];
  impactFactors: ImpactFactor[];
  keywordList: string[];
  yearAll: Year[] | null;
  yearFiltered: Year[] | null;
}
