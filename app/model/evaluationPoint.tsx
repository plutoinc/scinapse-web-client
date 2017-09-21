import { makeTypedFactory, TypedRecord } from "typed-immutable-record";

export interface IEvaluationPoint {
  analysis: number | null;
  analysisComment: string | null;
  contribution: number | null;
  contributionComment: string | null;
  expressiveness: number | null;
  expressivenessComment: string | null;
  originality: number | null;
  originalityComment: string | null;
  total: number | null;
}

export interface IEvaluationPointRecord extends TypedRecord<IEvaluationPointRecord>, IEvaluationPoint {}

export const initialEvaluationPoint: IEvaluationPoint = {
  analysis: null,
  analysisComment: null,
  contribution: null,
  contributionComment: null,
  expressiveness: null,
  expressivenessComment: null,
  originality: null,
  originalityComment: null,
  total: null,
};

export const EvaluationPointFactory = makeTypedFactory<IEvaluationPoint, IEvaluationPointRecord>(
  initialEvaluationPoint,
);
