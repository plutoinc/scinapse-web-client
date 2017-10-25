import * as _ from "lodash";
import { List } from "immutable";
import { recordify, TypedRecord } from "typed-immutable-record";
import { ICommentRecord } from "./comment";
import { IMemberRecord, IMember, recordifyMember } from "./member";
import { IEvaluationPoint, IEvaluationPointRecord, EvaluationPointFactory } from "./evaluationPoint";

export type EVALUATION_TYPES = "Originality" | "Significance" | "Validity" | "Organization";

export interface IEvaluation {
  id: number | null;
  articleId: number;
  createdAt: string;
  createdBy: IMember;
  vote: number;
  voted: boolean;
  point: IEvaluationPoint;
}

export interface IEvaluationPart {
  id: number | null;
  articleId: number;
  createdAt: string;
  createdBy: IMemberRecord;
  vote: number;
  voted: boolean;
  point: IEvaluationPointRecord;
}

export interface IEvaluationRecord extends TypedRecord<IEvaluationRecord>, IEvaluationPart {}
export interface IEvaluationsRecord extends List<IEvaluationRecord | null> {}
export const EVALUATIONS_INITIAL_STATE: IEvaluationsRecord = List();

export const initialEvaluation: IEvaluation = {
  id: null,
  articleId: null,
  createdAt: null,
  createdBy: null,
  vote: null,
  voted: false,
  point: null,
};

export function recordifyEvaluation(evaluation: IEvaluation = initialEvaluation): IEvaluationRecord {
  let recordifiedComments: List<ICommentRecord> = null;
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
    articleId: evaluation.articleId,
    comments: recordifiedComments,
    createdAt: evaluation.createdAt,
    createdBy: recordifiedCreatedBy,
    vote: evaluation.vote,
    voted: evaluation.voted,
    point: recordifiedPoint,
  });
}
