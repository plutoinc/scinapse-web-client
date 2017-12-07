import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IArticleRecord, recordifyArticle, IArticle } from "../model/article";
import { IReviewRecord, recordifyReview, IReview } from "../model/review";
import { IAuthor } from "../model/author";
import { ARTICLE_CATEGORY } from "../components/articleCreate/records";
import { IComment, recordifyComment, ICommentRecord } from "../model/comment";
import { FEED_SORTING_OPTIONS } from "../components/articleFeed/records";
import { IArticlePointRecord, ArticlePointFactory } from "../model/articlePoint";
import { IPaperRecord, IPaper, recordifyPaper } from "../model/paper";
import { recordifyPaperComment, IPaperCommentRecord } from "../model/paperComment";

export interface IPostCommentParams {
  articleId: number;
  reviewId: number;
  comment: string;
}

export interface IGetArticleReviewsParams {
  articleId: number;
  cancelTokenSource: CancelTokenSource;
  size?: number;
  page?: number;
  sort?: string;
}

export interface IDeleteArticleReviewParams {
  articleId: number;
  reviewId: number;
}

export interface IGetCommentsParams {
  articleId: number;
  reviewId: number;
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

export interface ISubmitReviewParams {
  articleId: number;
  originalityScore: number;
  significanceScore: number;
  validityScore: number;
  organizationScore: number;
  review: string;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetPapersParams {
  size?: number;
  page: number;
  query: string;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetCitedPapersParams {
  size?: number;
  paperId: number;
  page: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetPapersResult {
  papers: List<IPaperRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}

export interface IPostPaperCommentParams {
  paperId: number;
  comment: string;
}

class ArticleAPI extends PlutoAxios {
  public async getPapers({
    size = 10,
    page = 0,
    query,
    cancelTokenSource,
  }: IGetPapersParams): Promise<IGetPapersResult> {
    const articlesResponse: AxiosResponse = await this.get("papers", {
      params: {
        size,
        page,
        query,
      },
      cancelToken: cancelTokenSource.token,
    });
    const rawPapers: IPaper[] = articlesResponse.data.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
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
      papers: List(recordifiedPapersArray),
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

  public async getCitedPapers({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    const articlesResponse: AxiosResponse = await this.get(`papers/${paperId}/cited`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });
    const rawPapers: IPaper[] = articlesResponse.data.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
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
      papers: List(recordifiedPapersArray),
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

  public async getReferencesPapers({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    const articlesResponse: AxiosResponse = await this.get(`papers/${paperId}/references`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });
    const rawPapers: IPaper[] = articlesResponse.data.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
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
      papers: List(recordifiedPapersArray),
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

  public async postPaperComment(params: IPostPaperCommentParams): Promise<IPaperCommentRecord> {
    const commentResponse = await this.post(`papers/${params.paperId}/comments`, {
      comment: params.comment,
    });

    const commentData = commentResponse.data;
    const recordifiedComment = recordifyPaperComment(commentData);
    return recordifiedComment;
  }

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

  public async getComments({ articleId, reviewId, size = 10, page = 0, cancelTokenSource }: IGetCommentsParams) {
    const commentsResult = await this.get(`/articles/${articleId}/reviews/${reviewId}/comments`, {
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

  public async getReviews({ articleId, size = 10, page = 0, cancelTokenSource, sort }: IGetArticleReviewsParams) {
    const reviewsResult = await this.get(`/articles/${articleId}/reviews`, {
      params: {
        size,
        page,
        sort,
      },
      cancelToken: cancelTokenSource.token,
    });

    const rawReviews: IReview[] = reviewsResult.data.content;

    const recordifiedReviewArray = rawReviews.map(review => {
      return recordifyReview(review);
    });

    return {
      reviews: List(recordifiedReviewArray),
      first: reviewsResult.data.first,
      last: reviewsResult.data.last,
      number: reviewsResult.data.number,
      numberOfElements: reviewsResult.data.numberOfElements,
      size: reviewsResult.data.size,
      sort: reviewsResult.data.sort,
      totalElements: reviewsResult.data.totalElements,
      totalPages: reviewsResult.data.totalPages,
    };
  }

  public async deleteReview({ articleId, reviewId }: IDeleteArticleReviewParams) {
    await this.delete(`/articles/${articleId}/reviews/${reviewId}`);
  }

  public async postReview(params: ISubmitReviewParams): Promise<IReviewRecord> {
    const reviewResponse = await this.post(`articles/${params.articleId}/reviews`, {
      point: {
        originality: params.originalityScore,
        significance: params.significanceScore,
        validity: params.validityScore,
        organization: params.organizationScore,
        review: params.review,
      },
    });

    const reviewData = reviewResponse.data;
    const recordifiedReview = recordifyReview(reviewData);
    return recordifiedReview;
  }

  public async postComment(params: IPostCommentParams): Promise<ICommentRecord> {
    const commentResponse = await this.post(`articles/${params.articleId}/reviews/${params.reviewId}/comments`, {
      reviewId: params.reviewId,
      comment: params.comment,
    });

    const commentData = commentResponse.data;
    const recordifiedComment = recordifyComment(commentData);
    return recordifiedComment;
  }

  public async createArticle(params: ICreateArticleParams): Promise<IArticleRecord> {
    const createdArticle = await this.post(`articles`, params);
    const createdArticleRecord: IArticleRecord = recordifyArticle(createdArticle.data);

    return createdArticleRecord;
  }

  public async voteReview(articleId: number, reviewId: number) {
    const voteResponse = await this.post(`articles/${articleId}/reviews/${reviewId}/vote`);
    const voteData = voteResponse.data;

    return voteData;
  }

  public async unVoteReview(articleId: number, reviewId: number) {
    const unVoteResponse = await this.delete(`articles/${articleId}/reviews/${reviewId}/vote`);
    const unVoteData = unVoteResponse.data;

    return unVoteData;
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
