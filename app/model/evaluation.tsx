import * as _ from "lodash";
import { List } from "immutable";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IComment, ICommentRecord, recordifyComment } from "./comment";
import { IMemberRecord, IMember, recordifyMember } from "./member";
import { IEvaluationPoint, IEvaluationPointRecord, EvaluationPointFactory } from "./evaluationPoint";

export interface IEvaluation {
  comments: IComment[];
  createdAt: string;
  createdBy: IMember;
  like: number;
  point: IEvaluationPoint;
}

export interface IEvaluationPart {
  comments: List<ICommentRecord>;
  createdAt: string;
  createdBy: IMemberRecord;
  like: number;
  point: IEvaluationPointRecord;
}

export interface IEvaluationRecord extends TypedRecord<IEvaluationRecord>, IEvaluationPart {}

export const initialEvaluation: IEvaluation = {
  comments: null,
  createdAt: null,
  createdBy: null,
  like: null,
  point: null,
};

export function recordifyEvaluation(evaluation: IEvaluation = initialEvaluation): IEvaluationRecord {
  let recordifiedComments: List<ICommentRecord> = null;
  let recordifiedCreatedBy: IMemberRecord = null;
  let recordifiedPoint: IEvaluationPointRecord = null;

  if (evaluation.comments) {
    const recordMappedComments = evaluation.comments.map(comment => {
      if (comment && _.isEmpty(comment)) {
        return recordifyComment(comment);
      }
    });
    recordifiedComments = List(recordMappedComments);
  }

  if (evaluation.createdBy && !_.isEmpty(evaluation.createdBy)) {
    recordifiedCreatedBy = recordifyMember(evaluation.createdBy);
  }

  if (evaluation.point && !_.isEmpty(evaluation.point)) {
    recordifiedPoint = EvaluationPointFactory(evaluation.point);
  }

  return recordify({
    comments: recordifiedComments,
    createdAt: evaluation.createdAt,
    createdBy: recordifiedCreatedBy,
    like: evaluation.like,
    point: recordifiedPoint,
  });
}
