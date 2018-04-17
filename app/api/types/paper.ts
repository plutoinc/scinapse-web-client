import { CancelTokenSource } from "axios";
import { List } from "immutable";
import { PaperRecord } from "../../model/paper";

export interface GetAggregationParams {
  query: string;
  filter: string;
  cancelTokenSource?: CancelTokenSource;
}

export interface GetPapersParams {
  size?: number;
  page: number;
  query: string;
  filter: string;
  cancelTokenSource?: CancelTokenSource;
}

export interface GetRefOrCitedPapersParams {
  size?: number;
  paperId: number;
  page: number;
  filter: string;
  cancelTokenSource?: CancelTokenSource;
}

export interface GetPapersResult {
  papers: List<PaperRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}
