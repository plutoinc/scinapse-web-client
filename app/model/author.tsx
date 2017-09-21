import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { recordifyMember, IMemberRecord, IMember } from "./member";

export interface IAuthor {
  organization: string | null;
  name: string | null;
  member?: IMember | null;
}

export interface IAuthorPart {
  organization: string | null;
  name: string | null;
  member: IMemberRecord | null;
}

export interface IAuthorRecord extends TypedRecord<IAuthorRecord>, IAuthorPart {}

export const initialAuthor: IAuthor = {
  organization: null,
  name: null,
  member: null,
};

export function recordifyAuthor(author: IAuthor = initialAuthor): IAuthorRecord {
  let recordifiedAuthor: IMemberRecord = null;
  if (author.member && !_.isEmpty(author.member)) {
    recordifiedAuthor = recordifyMember(author.member);
  }

  return recordify({
    organization: author.organization,
    name: author.name,
    member: recordifiedAuthor,
  });
}
