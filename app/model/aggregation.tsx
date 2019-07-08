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

export interface Year {
  year: number;
  docCount: number;
}

interface ImpactFactor {
  from: number;
  to: number | null;
  docCount: number;
}

export interface AggregationData {
  fosList: AggregationFos[];
  journals: AggregationJournal[];
  impactFactors: ImpactFactor[];
  keywordList: string[];
  yearAll: Year[] | null;
  yearFiltered: Year[] | null;
}
