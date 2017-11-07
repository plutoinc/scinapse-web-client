import * as _ from "lodash";
import { List } from "immutable";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IMemberRecord, IMember, recordifyMember } from "./member";
import { IEvaluationPoint, IEvaluationPointRecord, EvaluationPointFactory } from "./evaluationPoint";

export interface IReview {
  id: number | null;
  commentSize: number | null;
  articleId: number;
  createdAt: string;
  createdBy: IMember;
  vote: number;
  voted: boolean;
  point: IEvaluationPoint;
}

export interface IReviewPart {
  id: number | null;
  commentSize: number | null;
  articleId: number;
  createdAt: string;
  createdBy: IMemberRecord;
  vote: number;
  voted: boolean;
  point: IEvaluationPointRecord;
}

export interface IReviewRecord extends TypedRecord<IReviewRecord>, IReviewPart {}
export interface IReviewsRecord extends List<IReviewRecord | null> {}
export const EVALUATIONS_INITIAL_STATE: IReviewsRecord = List();

export const initialEvaluation: IReview = {
  id: null,
  commentSize: 0,
  articleId: null,
  createdAt: null,
  createdBy: null,
  vote: null,
  voted: false,
  point: null,
};

export function recordifyEvaluation(evaluation: IReview = initialEvaluation): IReviewRecord {
  let recordifiedCreatedBy: IMemberRecord = null;
  let recordifiedPoint: IEvaluationPointRecord = null;

  if (evaluation.createdBy && !_.isEmpty(evaluation.createdBy)) {
    recordifiedCreatedBy = recordifyMember(evaluation.createdBy);
  }

  if (evaluation.point && !_.isEmpty(evaluation.point)) {
    recordifiedPoint = EvaluationPointFactory(evaluation.point);
  }

  return recordify({
    id: evaluation.id,
    commentSize: evaluation.commentSize || 0,
    articleId: evaluation.articleId,
    createdAt: evaluation.createdAt,
    createdBy: recordifiedCreatedBy,
    vote: evaluation.vote,
    voted: evaluation.voted,
    point: recordifiedPoint,
  });
}
