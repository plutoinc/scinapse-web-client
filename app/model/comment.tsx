import * as _ from "lodash";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IMember, IMemberRecord, recordifyMember } from "./member";

export interface IComment {
  createdAt: number | null;
  createdBy: IMember | null;
  comment: string | null;
}

export interface ICommentPart {
  createdAt: number | null;
  createdBy: IMemberRecord | null;
  comment: string | null;
}

export interface ICommentRecord extends TypedRecord<ICommentRecord>, ICommentPart {}

export const initialComment: IComment = {
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
    createdAt: comment.createdAt,
    createdBy: recordifiedCreatedBy,
    comment: comment.comment,
  });
}
