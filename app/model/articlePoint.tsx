import { makeTypedFactory, TypedRecord } from "typed-immutable-record";

export interface IArticlePoint {
  analysis: number | null;
  contribution: number | null;
  expressiveness: number | null;
  originality: number | null;
  total: number | null;
}

export interface IArticlePointRecord extends TypedRecord<IArticlePointRecord>, IArticlePoint {}

export const initialArticlePoint: IArticlePoint = {
  analysis: null,
  contribution: null,
  expressiveness: null,
  originality: null,
  total: null,
};

export const ArticlePointFactory = makeTypedFactory<IArticlePoint, IArticlePointRecord>(initialArticlePoint);
