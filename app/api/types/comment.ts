import { ICommentRecord } from "../../model/comment";
import { List } from "immutable";

export interface GetCommentsParams {
  page: number;
  paperId: number;
  size?: number;
}

export interface GetCommentsResult {
  comments: List<ICommentRecord | undefined>;
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
}

export interface PostCommentParams {
  paperId: number;
  cognitivePaperId?: number;
  comment: string;
}

export interface DeleteCommentParams {
  commentId: number;
  paperId: number;
}

export interface DeleteCommentResult {
  success: boolean;
}
