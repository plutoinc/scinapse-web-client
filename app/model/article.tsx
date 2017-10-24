import * as _ from "lodash";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IMember, IMemberRecord, recordifyMember } from "./member";
import { IAuthorRecord, IAuthor, recordifyAuthor } from "./author";
import { IArticlePoint, IArticlePointRecord, ArticlePointFactory } from "./articlePoint";
import { IEvaluationRecord } from "./evaluation";

export interface IArticle {
  summary: string | null;
  id: number | null;
  authors: IAuthor[] | null;
  createdAt: string | null;
  createdBy: IMember | null;
  evaluated: boolean | null;
  link: string | null;
  point: IArticlePoint | null;
  source: string | null;
  title: string | null;
  type: string | null;
  note?: string | null;
}

export interface IArticlePart {
  summary: string | null;
  id: number | null;
  authors: List<IAuthorRecord> | null;
  createdAt: string | null;
  createdBy: IMemberRecord | null;
  evaluated: boolean | null;
  link: string | null;
  point: IArticlePointRecord | null;
  source: string | null;
  title: string | null;
  type: string | null;
  note?: string | null;
}

export interface IArticleRecord extends TypedRecord<IArticleRecord>, IArticlePart {}

export interface IArticlesRecord extends List<IArticleRecord> {}

export const initialArticle: IArticle = {
  summary: null,
  id: null,
  authors: null,
  createdAt: null,
  createdBy: null,
  evaluated: null,
  link: null,
  point: null,
  source: null,
  title: null,
  type: null,
  note: null,
};

export const ARTICLE_INITIAL_STATE: IArticlesRecord = List();

export function recordifyArticle(article: IArticle = initialArticle): IArticleRecord {
  let recordifiedAuthors: List<IAuthorRecord> = null;
  let recordifiedCreatedBy: IMemberRecord = null;
  let recordifiedEvaluations: List<IEvaluationRecord> = null;
  let recordifiedPoint: IArticlePointRecord = null;

  if (article.authors) {
    const recordMappedAuthors = article.authors.map(author => {
      if (author && !_.isEmpty(author)) {
        return recordifyAuthor(author);
      }
    });
    recordifiedAuthors = List(recordMappedAuthors);
  }

  if (article.createdBy && !_.isEmpty(article.createdBy)) {
    recordifiedCreatedBy = recordifyMember(article.createdBy);
  }

  if (article.point && !_.isEmpty(article.point)) {
    recordifiedPoint = ArticlePointFactory(article.point);
  }

  return recordify({
    summary: article.summary,
    id: article.id,
    authors: recordifiedAuthors,
    createdAt: article.createdAt,
    createdBy: recordifiedCreatedBy,
    evaluations: recordifiedEvaluations,
    evaluated: article.evaluated,
    link: article.link,
    point: recordifiedPoint,
    source: article.source,
    title: article.title,
    type: article.type,
    note: article.note || null,
  });
}
