import { makeTypedFactory, TypedRecord } from "typed-immutable-record";

export type REVIEW_POINT_TYPES = "Originality" | "Significance" | "Validity" | "Organization";

export interface IReviewPoint {
  originality: number | null;
  significance: number | null;
  validity: number | null;
  organization: number | null;
  review: string | null;
  total: number | null;
}

export interface IReviewPointRecord extends TypedRecord<IReviewPointRecord>, IReviewPoint {}

export const initialReviewPoint: IReviewPoint = {
  validity: null,
  significance: null,
  organization: null,
  originality: null,
  review: null,
  total: null,
};

export const ReviewPointFactory = makeTypedFactory<IReviewPoint, IReviewPointRecord>(initialReviewPoint);
