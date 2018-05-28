import { schema } from "normalizr";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { Member, MemberRecord, recordifyMember } from "./member";

export interface Comment {
  id: number;
  paperId: number;
  createdAt: string;
  createdBy: Member | null;
  comment: string;
}

export interface CommentPart {
  id: number;
  paperId: number;
  createdAt: string;
  createdBy: MemberRecord | null;
  comment: string;
}

export interface CommentRecord extends TypedRecord<CommentRecord>, CommentPart {}
export interface CommentsRecord extends List<CommentRecord> {}

export const COMMENTS_INITIAL_STATE = List([]);

export const initialComment: Comment = {
  id: 0,
  paperId: 0,
  createdAt: "",
  createdBy: null,
  comment: "",
};

export function recordifyComment(comment: Comment = initialComment): CommentRecord {
  return recordify({
    id: comment.id,
    paperId: comment.paperId,
    createdAt: comment.createdAt,
    createdBy: recordifyMember(comment.createdBy || undefined),
    comment: comment.comment,
  });
}

export function recordifyComments(comments: Comment[] | null): CommentsRecord {
  if (!comments) {
    return List();
  } else {
    const commentArray = comments.map(comment => {
      return recordifyComment(comment);
    });

    return List(commentArray);
  }
}

export const commentSchema = new schema.Entity("comments");
