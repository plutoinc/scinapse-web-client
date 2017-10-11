import * as _ from "lodash";
import { List } from "immutable";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IComment, ICommentRecord, recordifyComment } from "./comment";
import { IMemberRecord, IMember, recordifyMember } from "./member";
import { IEvaluationPoint, IEvaluationPointRecord, EvaluationPointFactory } from "./evaluationPoint";

export type EVALUATION_TYPES = "Originality" | "Contribution" | "Analysis" | "Expressiveness";

export interface IEvaluation {
  id: number | null;
  comments: IComment[];
  createdAt: string;
  createdBy: IMember;
  vote: number;
  point: IEvaluationPoint;
}

export interface IEvaluationPart {
  id: number | null;
  comments: List<ICommentRecord>;
  createdAt: string;
  createdBy: IMemberRecord;
  vote: number;
  point: IEvaluationPointRecord;
}

export interface IEvaluationRecord extends TypedRecord<IEvaluationRecord>, IEvaluationPart {}

export const initialEvaluation: IEvaluation = {
  id: null,
  comments: null,
  createdAt: null,
  createdBy: null,
  vote: null,
  point: null,
};

export function recordifyEvaluation(evaluation: IEvaluation = initialEvaluation): IEvaluationRecord {
  let recordifiedComments: List<ICommentRecord> = null;
  let recordifiedCreatedBy: IMemberRecord = null;
  let recordifiedPoint: IEvaluationPointRecord = null;

  if (evaluation.comments) {
    const recordMappedComments = evaluation.comments.map(comment => {
      if (comment && !_.isEmpty(comment)) {
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
    id: evaluation.id,
    comments: recordifiedComments,
    createdAt: evaluation.createdAt,
    createdBy: recordifiedCreatedBy,
    vote: evaluation.vote,
    point: recordifiedPoint,
  });
}
