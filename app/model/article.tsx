import * as _ from "lodash";
import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { IMember, IMemberRecord, recordifyMember } from "./member";
import { IAuthorRecord, IAuthor, recordifyAuthor } from "./author";
import { IArticlePoint, IArticlePointRecord, ArticlePointFactory } from "./articlePoint";
import { IEvaluation, IEvaluationRecord, recordifyEvaluation } from "./evaluation";

export interface IArticle {
  abstract: string | null;
  articleId: number | null;
  authors: IAuthor[] | null;
  createdAt: string | null;
  createdBy: IMember | null;
  evaluations: IEvaluation[] | null;
  link: string | null;
  point: IArticlePoint | null;
  source: string | null;
  title: string | null;
  type: string | null;
}

export interface IArticlePart {
  abstract: string | null;
  articleId: number | null;
  authors: List<IAuthorRecord> | null;
  createdAt: string | null;
  createdBy: IMemberRecord | null;
  evaluations: List<IEvaluationRecord> | null;
  link: string | null;
  point: IArticlePointRecord | null;
  source: string | null;
  title: string | null;
  type: string | null;
}

export interface IArticleStateRecord extends TypedRecord<IArticleStateRecord>, IArticlePart {}

export const initialArticle: IArticle = {
  abstract: null,
  articleId: null,
  authors: null,
  createdAt: null,
  createdBy: null,
  evaluations: null,
  link: null,
  point: null,
  source: null,
  title: null,
  type: null,
};

export const ARTICLE_INITIAL_STATE: IArticleStateRecord = recordifyArticle(initialArticle);

export function recordifyArticle(article: IArticle = initialArticle): IArticleStateRecord {
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

  if (article.evaluations) {
    const recordMappedEvaluations = article.evaluations.map(evaluation => {
      if (evaluation && !_.isEmpty(evaluation)) {
        return recordifyEvaluation(evaluation);
      }
    });
    recordifiedEvaluations = List(recordMappedEvaluations);
  }

  if (article.point && !_.isEmpty(article.point)) {
    recordifiedPoint = ArticlePointFactory(article.point);
  }

  return recordify({
    abstract: article.abstract,
    articleId: article.articleId,
    authors: recordifiedAuthors,
    createdAt: article.createdAt,
    createdBy: recordifiedCreatedBy,
    evaluations: recordifiedEvaluations,
    link: article.link,
    point: recordifiedPoint,
    source: article.source,
    title: article.title,
    type: article.type,
  });
}
