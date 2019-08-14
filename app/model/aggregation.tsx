export interface AggregationJournal {
  id: number;
  title: string;
  docCount: number;
  impactFactor: number;
  abbrev: string | null;
  sci: boolean;
  jc: 'JOURNAL' | 'CONFERENCE';
  // added by client
  missingDocCount?: boolean;
}

export interface AggregationFos {
  id: number;
  name: string;
  level: number;
  docCount: number;
  // added by client
  missingDocCount?: boolean;
}

export interface Year {
  year: number;
  docCount: number;
}

export interface AggregationData {
  fosList: AggregationFos[];
  journals: AggregationJournal[];
  yearAll: Year[] | null;
  yearFiltered: Year[] | null;
}
