import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { recordifyMember, IMemberRecord, IMember } from "./member";

type AUTHOR_TYPES = "LEAD_AUTHOR" | "CORRESPONDING_AUTHOR" | "CO_AUTHOR";

export interface IAuthor {
  id: number | null;
  type: AUTHOR_TYPES | null;
  institution: string | null;
  name: string | null;
  member?: IMember | null;
}

export interface IAuthorPart {
  id: number | null;
  type: AUTHOR_TYPES | null;
  institution: string | null;
  name: string | null;
  member: IMemberRecord | null;
}

export interface IAuthorRecord extends TypedRecord<IAuthorRecord>, IAuthorPart {}

export const initialAuthor: IAuthor = {
  id: null,
  type: null,
  institution: null,
  name: null,
  member: null,
};

export function recordifyAuthor(author: IAuthor = initialAuthor): IAuthorRecord {
  let recordifiedAuthor: IMemberRecord = null;
  if (author.member && !_.isEmpty(author.member)) {
    recordifiedAuthor = recordifyMember(author.member);
  }

  return recordify({
    id: author.id,
    type: author.type,
    institution: author.institution,
    name: author.name,
    member: recordifiedAuthor,
  });
}
