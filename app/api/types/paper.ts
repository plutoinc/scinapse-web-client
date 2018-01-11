import { CancelTokenSource } from "axios";
import { List } from "immutable";
import { IPaperRecord } from "../../model/paper";
import { ICommentRecord } from "../../model/comment";

export interface IGetPapersParams {
  size?: number;
  page: number;
  query: string;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetCitedPapersParams {
  size?: number;
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

export interface IGetPaperCommentsParams {
  size?: number;
  page: number;
  paperId: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetPaperCommentsResult {
  comments: List<ICommentRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}

export interface IPostPaperCommentParams {
  paperId: number;
  comment: string;
}

export interface IDeletePaperCommentParams {
  paperId: number;
  commentId: number;
}

export interface IDeletePaperCommentResult {
  success: boolean;
}
