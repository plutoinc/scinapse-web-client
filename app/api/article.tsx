import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IArticleRecord, recordifyArticle, IArticle } from "../model/article";
import { IEvaluationRecord, recordifyEvaluation, IEvaluation } from "../model/evaluation";
import { IAuthor } from "../model/author";
import { ARTICLE_CATEGORY } from "../components/articleCreate/records";
import { IComment, recordifyComment, ICommentRecord } from "../model/comment";
import { FEED_SORTING_OPTIONS } from "../components/articleFeed/records";
import { IArticlePointRecord, ArticlePointFactory } from "../model/articlePoint";

export interface IPostCommentParams {
  articleId: number;
  evaluationId: number;
  comment: string;
}

export interface IGetArticleEvaluationsParams {
  articleId: number;
  cancelTokenSource: CancelTokenSource;
  size?: number;
  page?: number;
  sort?: string;
}

export interface IGetCommentsParams {
  articleId: number;
  evaluationId: number;
  cancelTokenSource: CancelTokenSource;
  size?: number;
  page?: number;
}

export interface IGetArticlesParams {
  size?: number;
  page?: number;
  ids?: number[];
  sort: FEED_SORTING_OPTIONS;
  cancelTokenSource: CancelTokenSource;
}

export interface ICreateArticleParams {
  articlePublishedAt?: string;
  articleUpdatedAt?: string;
  authors?: IAuthor[];
  link?: string;
  note?: string;
  source?: string;
  summary?: string;
  title: string;
  type: ARTICLE_CATEGORY;
}

interface IGetArticlesResult {
  articles: List<IArticleRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}

export interface ISubmitEvaluationParams {
  articleId: number;
  originalityScore: number;
  significanceScore: number;
  validityScore: number;
  organizationScore: number;
  review: string;
  cancelTokenSource: CancelTokenSource;
}
class ArticleAPI extends PlutoAxios {
  public async getArticles({
    size = 10,
    page = 0,
    ids,
    sort,
    cancelTokenSource,
  }: IGetArticlesParams): Promise<IGetArticlesResult> {
    const sortingQuery = sort === FEED_SORTING_OPTIONS.SCORE ? "point.total,desc" : "createdAt,desc";

    const articlesResponse: AxiosResponse = await this.get("articles", {
      params: {
        size,
        page,
        sort: sortingQuery,
        ids: ids.join(","),
      },
      cancelToken: cancelTokenSource.token,
    });
    const rawArticles: IArticle[] = articlesResponse.data.content;

    const recordifiedArticlesArray = rawArticles.map(article => {
      return recordifyArticle(article);
    });

    /* ***
    ******* PAGINATION RESPONSE FIELD INFORMATION *******
    **
    - content : array - Data of query
    - size : int - The number of the page
    - number : int - Current page number
    - sort : object - Sorting information
    - first : bool - True if the response page is the first page
    - last : bool - True if the response page is the last page
    - numberOfElements : int - The number of data of the current response page
    - totalPages : int - The number of the total page.
    - totalElements : int - The number of the total element.
    *** */

    return {
      articles: List(recordifiedArticlesArray),
      first: articlesResponse.data.first,
      last: articlesResponse.data.last,
      number: articlesResponse.data.number,
      numberOfElements: articlesResponse.data.numberOfElements,
      size: articlesResponse.data.size,
      sort: articlesResponse.data.sort,
      totalElements: articlesResponse.data.totalElements,
      totalPages: articlesResponse.data.totalPages,
    };
  }

  public async getArticle(articleId: number, cancelTokenSource: CancelTokenSource): Promise<IArticleRecord> {
    const rawArticle = await this.get(`articles/${articleId}`, {
      cancelToken: cancelTokenSource.token,
    });

    return recordifyArticle(rawArticle.data);
  }

  public async getArticlePoint(articleId: number, cancelTokenSource: CancelTokenSource): Promise<IArticlePointRecord> {
    const rawArticlePoint = await this.get(`articles/${articleId}/point`, {
      cancelToken: cancelTokenSource.token,
    });

    return ArticlePointFactory(rawArticlePoint.data);
  }

  public async getComments({ articleId, evaluationId, size = 10, page = 0, cancelTokenSource }: IGetCommentsParams) {
    const commentsResult = await this.get(`/articles/${articleId}/evaluations/${evaluationId}/comments`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });

    const rawComments: IComment[] = commentsResult.data.content;

    const recordifiedCommentArray = rawComments.map(comment => {
      return recordifyComment(comment);
    });

    return {
      comments: List(recordifiedCommentArray),
      first: commentsResult.data.first,
      last: commentsResult.data.last,
      number: commentsResult.data.number,
      numberOfElements: commentsResult.data.numberOfElements,
      size: commentsResult.data.size,
      sort: commentsResult.data.sort,
      totalElements: commentsResult.data.totalElements,
      totalPages: commentsResult.data.totalPages,
    };
  }

  public async getEvaluations({
    articleId,
    size = 10,
    page = 0,
    cancelTokenSource,
    sort,
  }: IGetArticleEvaluationsParams) {
    const evaluationsResult = await this.get(`/articles/${articleId}/evaluations`, {
      params: {
        size,
        page,
        sort,
      },
      cancelToken: cancelTokenSource.token,
    });

    const rawEvaluations: IEvaluation[] = evaluationsResult.data.content;

    const recordifiedEvaluationArray = rawEvaluations.map(evaluation => {
      return recordifyEvaluation(evaluation);
    });

    return {
      evaluations: List(recordifiedEvaluationArray),
      first: evaluationsResult.data.first,
      last: evaluationsResult.data.last,
      number: evaluationsResult.data.number,
      numberOfElements: evaluationsResult.data.numberOfElements,
      size: evaluationsResult.data.size,
      sort: evaluationsResult.data.sort,
      totalElements: evaluationsResult.data.totalElements,
      totalPages: evaluationsResult.data.totalPages,
    };
  }

  public async postEvaluation(params: ISubmitEvaluationParams): Promise<IEvaluationRecord> {
    const evaluationResponse = await this.post(`articles/${params.articleId}/evaluations`, {
      point: {
        originality: params.originalityScore,
        significance: params.significanceScore,
        validity: params.validityScore,
        organization: params.organizationScore,
        review: params.review,
      },
    });

    const evaluationData = evaluationResponse.data;
    const recordifiedEvaluation = recordifyEvaluation(evaluationData);
    return recordifiedEvaluation;
  }

  public async postComment(params: IPostCommentParams): Promise<ICommentRecord> {
    const commentResponse = await this.post(
      `articles/${params.articleId}/evaluations/${params.evaluationId}/comments`,
      {
        evaluationId: params.evaluationId,
        comment: params.comment,
      },
    );

    const commentData = commentResponse.data;
    const recordifiedComment = recordifyComment(commentData);
    return recordifiedComment;
  }

  public async createArticle(params: ICreateArticleParams): Promise<IArticleRecord> {
    const createdArticle = await this.post(`articles`, params);
    const createdArticleRecord: IArticleRecord = recordifyArticle(createdArticle.data);

    return createdArticleRecord;
  }

  public async voteEvaluation(articleId: number, evaluationId: number) {
    const voteResponse = await this.post(`articles/${articleId}/evaluations/${evaluationId}/vote`);
    const voteData = voteResponse.data;

    return voteData;
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
