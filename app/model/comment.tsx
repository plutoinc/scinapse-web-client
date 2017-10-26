import * as _ from "lodash";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IMember, IMemberRecord, recordifyMember } from "./member";

export interface IComment {
  id: number | null;
  evaluationId: number | null;
  createdAt: string | null;
  createdBy: IMember | null;
  comment: string | null;
}

export interface ICommentPart {
  id: number | null;
  evaluationId: number | null;
  createdAt: string | null;
  createdBy: IMemberRecord | null;
  comment: string | null;
}

export interface ICommentRecord extends TypedRecord<ICommentRecord>, ICommentPart {}
export interface ICommentsRecord extends List<ICommentRecord> {}

export const COMMENTS_INITIAL_STATE = List([]);

export const initialComment: IComment = {
  id: null,
  evaluationId: null,
  createdAt: null,
  createdBy: null,
  comment: null,
};

export function recordifyComment(comment: IComment = initialComment): ICommentRecord {
  let recordifiedCreatedBy: IMemberRecord = null;

  if (comment.createdBy && !_.isEmpty(comment.createdBy)) {
    recordifiedCreatedBy = recordifyMember(comment.createdBy);
  }

  return recordify({
    id: comment.id,
    evaluationId: comment.evaluationId,
    createdAt: comment.createdAt,
    createdBy: recordifiedCreatedBy,
    comment: comment.comment,
  });
}
