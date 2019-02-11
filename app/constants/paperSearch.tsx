export enum FILTER_RANGE_TYPE {
  FROM,
  TO,
}

export enum FILTER_TYPE_HAS_RANGE {
  PUBLISHED_YEAR,
  JOURNAL_IF,
}

export enum FILTER_TYPE_HAS_EXPANDING_OPTION {
  FOS,
  JOURNAL,
}

export type FILTER_BOX_TYPE = "PUBLISHED_YEAR" | "JOURNAL_IF" | "FOS" | "JOURNAL";

export interface ChangeRangeInputParams {
  type: FILTER_TYPE_HAS_RANGE;
  rangeType: FILTER_RANGE_TYPE;
  numberValue: number | undefined;
}
