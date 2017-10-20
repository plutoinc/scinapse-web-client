import { makeTypedFactory, TypedRecord } from "typed-immutable-record";

export interface IEvaluationPoint {
  originality: number | null;
  originalityComment: string | null;
  significance: number | null;
  significanceComment: string | null;
  validity: number | null;
  validityComment: string | null;
  organization: number | null;
  organizationComment: string | null;
  total: number | null;
}

export interface IEvaluationPointRecord extends TypedRecord<IEvaluationPointRecord>, IEvaluationPoint {}

export const initialEvaluationPoint: IEvaluationPoint = {
  validity: null,
  validityComment: null,
  significance: null,
  significanceComment: null,
  organization: null,
  organizationComment: null,
  originality: null,
  originalityComment: null,
  total: null,
};

export const EvaluationPointFactory = makeTypedFactory<IEvaluationPoint, IEvaluationPointRecord>(
  initialEvaluationPoint,
);
