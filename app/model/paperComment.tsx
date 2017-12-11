import * as _ from "lodash";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IMember, IMemberRecord, recordifyMember } from "./member";

export interface IPaperComment {
  id: number | null;
  paperId: number | null;
  createdAt: string | null;
  createdBy: IMember | null;
  comment: string | null;
}

export interface IPaperCommentPart {
  id: number | null;
  paperId: number | null;
  createdAt: string | null;
  createdBy: IMemberRecord | null;
  comment: string | null;
}

export interface IPaperCommentRecord extends TypedRecord<IPaperCommentRecord>, IPaperCommentPart {}
export interface IPaperCommentsRecord extends List<IPaperCommentRecord> {}

export const COMMENTS_INITIAL_STATE = List([]);

export const initialPaperComment: IPaperComment = {
  id: null,
  paperId: null,
  createdAt: null,
  createdBy: null,
  comment: null,
};

export function recordifyPaperComment(comment: IPaperComment = initialPaperComment): IPaperCommentRecord {
  let recordifiedCreatedBy: IMemberRecord = null;

  if (comment.createdBy && !_.isEmpty(comment.createdBy)) {
    recordifiedCreatedBy = recordifyMember(comment.createdBy);
  }

  return recordify({
    id: comment.id,
    paperId: comment.paperId,
    createdAt: comment.createdAt,
    createdBy: recordifiedCreatedBy,
    comment: comment.comment,
  });
}
