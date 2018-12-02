import { CancelTokenSource, CancelToken } from "axios";
import { Paper } from "../../model/paper";

export interface GetAggregationParams {
  query: string;
  filter: string;
  cancelToken: CancelToken;
}

export interface GetPapersParams {
  sort: string;
  page: number;
  query: string;
  filter: string;
  size?: number;
  cancelToken?: CancelToken;
}

export interface GetRefOrCitedPapersParams {
  size?: number;
  paperId: number;
  page: number;
  filter: string;
  cancelTokenSource?: CancelTokenSource;
}

export interface GetPapersResult {
  papers: Paper[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}
