import { CancelTokenSource } from "axios";
import { ICommentRecord } from "../../model/comment";
import { List } from "immutable";

export interface GetCommentsComponentParams {
  size?: number;
  cognitiveId?: number;
  page: number;
  paperId: number;
}

export interface GetCommentsParams extends GetCommentsComponentParams {
  cognitive?: boolean;
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

export interface PostCommentsComponentParams {
  index: number;
  paperId: number;
  cognitivePaperId?: number;
}

export interface PostCommentParams {
  paperId: number;
  cognitivePaperId?: number;
  comment: string;
}

export interface IDeleteCommentParams {
  paperId: number;
  commentId: number;
}

export interface IDeleteCommentResult {
  success: boolean;
}
