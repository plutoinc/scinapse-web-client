import { Comment } from '../../model/comment';
import { CommonPaginationResponsePart } from './common';

export interface GetCommentsParams {
  page: number;
  paperId: number;
  size?: number;
}

export interface GetCommentsResult extends CommonPaginationResponsePart {
  entities: { comments: { [commentId: number]: Comment } };
  result: number[];
}

export interface GetRawCommentsResult extends CommonPaginationResponsePart {
  content: Comment[];
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
