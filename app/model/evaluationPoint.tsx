import { makeTypedFactory, TypedRecord } from "typed-immutable-record";

export interface IEvaluationPoint {
  originality: number | null;
  significance: number | null;
  validity: number | null;
  organization: number | null;
  review: string | null;
  total: number | null;
}

export interface IEvaluationPointRecord extends TypedRecord<IEvaluationPointRecord>, IEvaluationPoint {}

export const initialEvaluationPoint: IEvaluationPoint = {
  validity: null,
  significance: null,
  organization: null,
  originality: null,
  review: null,
  total: null,
};

export const EvaluationPointFactory = makeTypedFactory<IEvaluationPoint, IEvaluationPointRecord>(
  initialEvaluationPoint,
);
