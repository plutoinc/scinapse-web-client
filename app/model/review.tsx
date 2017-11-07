import * as _ from "lodash";
import { List } from "immutable";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IMemberRecord, IMember, recordifyMember } from "./member";
import { IReviewPoint, IReviewPointRecord, ReviewPointFactory } from "./reviewPoint";

export interface IReview {
  id: number | null;
  commentSize: number | null;
  articleId: number;
  createdAt: string;
  createdBy: IMember;
  vote: number;
  voted: boolean;
  point: IReviewPoint;
}

export interface IReviewPart {
  id: number | null;
  commentSize: number | null;
  articleId: number;
  createdAt: string;
  createdBy: IMemberRecord;
  vote: number;
  voted: boolean;
  point: IReviewPointRecord;
}

export interface IReviewRecord extends TypedRecord<IReviewRecord>, IReviewPart {}
export interface IReviewsRecord extends List<IReviewRecord | null> {}
export const REVIEWS_INITIAL_STATE: IReviewsRecord = List();

export const initialReview: IReview = {
  id: null,
  commentSize: 0,
  articleId: null,
  createdAt: null,
  createdBy: null,
  vote: null,
  voted: false,
  point: null,
};

export function recordifyReview(review: IReview = initialReview): IReviewRecord {
  let recordifiedCreatedBy: IMemberRecord = null;
  let recordifiedPoint: IReviewPointRecord = null;

  if (review.createdBy && !_.isEmpty(review.createdBy)) {
    recordifiedCreatedBy = recordifyMember(review.createdBy);
  }

  if (review.point && !_.isEmpty(review.point)) {
    recordifiedPoint = ReviewPointFactory(review.point);
  }

  return recordify({
    id: review.id,
    commentSize: review.commentSize || 0,
    articleId: review.articleId,
    createdAt: review.createdAt,
    createdBy: recordifiedCreatedBy,
    vote: review.vote,
    voted: review.voted,
    point: recordifiedPoint,
  });
}
