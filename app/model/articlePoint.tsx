import { makeTypedFactory, TypedRecord } from "typed-immutable-record";

export interface IArticlePoint {
  total: number | null;
  originality: number | null;
  significance: number | null;
  validity: number | null;
  organization: number | null;
}

export interface IArticlePointRecord extends TypedRecord<IArticlePointRecord>, IArticlePoint {}

export const initialArticlePoint: IArticlePoint = {
  validity: null,
  significance: null,
  organization: null,
  originality: null,
  total: null,
};

export const ArticlePointFactory = makeTypedFactory<IArticlePoint, IArticlePointRecord>(initialArticlePoint);
