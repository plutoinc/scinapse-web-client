import { CancelTokenSource } from "axios";
import { List } from "immutable";
import { IPaperRecord } from "../../model/paper";

export interface IGetPapersParams {
  size?: number;
  page: number;
  query: string;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetRefOrCitedPapersParams {
  size?: number;
  paperId: number;
  page: number;
  cancelTokenSource: CancelTokenSource;
  cognitiveId: number | null;
}

export interface IGetRefOrCitedPapersAPIParams {
  size?: number;
  cognitive?: boolean;
  paperId: number;
  page: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetPapersResult {
  papers: List<IPaperRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}
