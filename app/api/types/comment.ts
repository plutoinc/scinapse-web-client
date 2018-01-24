import { CancelTokenSource } from "axios";
import { ICommentRecord } from "../../model/comment";
import { List } from "immutable";

export interface IGetCommentsParams {
  size?: number;
  page: number;
  paperId: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetCommentsResult {
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

export interface IPostCommentParams {
  paperId: number;
  comment: string;
}

export interface IDeleteCommentParams {
  paperId: number;
  commentId: number;
}

export interface IDeleteCommentResult {
  success: boolean;
}
