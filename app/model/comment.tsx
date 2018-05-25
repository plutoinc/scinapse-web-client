import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { Member, MemberRecord, recordifyMember } from "./member";

export interface IComment {
  id: number;
  paperId: number;
  createdAt: string;
  createdBy: Member | null;
  comment: string;
}

export interface ICommentPart {
  id: number;
  paperId: number;
  createdAt: string;
  createdBy: MemberRecord | null;
  comment: string;
}

export interface ICommentRecord extends TypedRecord<ICommentRecord>, ICommentPart {}
export interface ICommentsRecord extends List<ICommentRecord> {}

export const COMMENTS_INITIAL_STATE = List([]);

export const initialComment: IComment = {
  id: 0,
  paperId: 0,
  createdAt: "",
  createdBy: null,
  comment: "",
};

export function recordifyComment(comment: IComment = initialComment): ICommentRecord {
  return recordify({
    id: comment.id,
    paperId: comment.paperId,
    createdAt: comment.createdAt,
    createdBy: recordifyMember(comment.createdBy || undefined),
    comment: comment.comment,
  });
}

export function recordifyComments(comments: IComment[] | null): ICommentsRecord {
  if (!comments) {
    return List();
  } else {
    const commentArray = comments.map(comment => {
      return recordifyComment(comment);
    });

    return List(commentArray);
  }
}
