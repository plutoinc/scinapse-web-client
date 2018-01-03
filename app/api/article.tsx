import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IPaperRecord, IPaper, recordifyPaper } from "../model/paper";
import { recordifyPaperComment, IPaperCommentRecord, IPaperComment } from "../model/paperComment";

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

export interface IGetPaperCommentsParams {
  size?: number;
  page: number;
  paperId: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetPaperCommentsResult {
  comments: List<IPaperCommentRecord>;
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

export interface IDeletePaperCommentParams {
  paperId: number;
  commentId: number;
}

export interface IDeletePaperCommentResult {
  success: boolean;
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

  public async getPaper(paperId: number, cancelTokenSource: CancelTokenSource): Promise<IPaperRecord> {
    const rawPaper = await this.get(`papers/${paperId}`, {
      cancelToken: cancelTokenSource.token,
    });

    return recordifyPaper(rawPaper.data);
  }

  public async getPaperComments({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetPaperCommentsParams): Promise<IGetPaperCommentsResult> {
    const articlesResponse: AxiosResponse = await this.get(`papers/${paperId}/comments`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });
    const rawPaperComments: IPaperComment[] = articlesResponse.data.content;

    const recordifiedPaperCommentsArray = rawPaperComments.map((comment): IPaperCommentRecord => {
      return recordifyPaperComment(comment);
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
      comments: List(recordifiedPaperCommentsArray),
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

  public async postPaperComment({ paperId, comment }: IPostPaperCommentParams): Promise<IPaperCommentRecord> {
    const commentResponse = await this.post(`papers/${paperId}/comments`, {
      comment: comment,
    });

    const commentData = commentResponse.data;
    const recordifiedComment = recordifyPaperComment(commentData);
    return recordifiedComment;
  }

  public async deletePaperComment({
    paperId,
    commentId,
  }: IDeletePaperCommentParams): Promise<IDeletePaperCommentResult> {
    const response = await this.delete(`/papers/${paperId}/comments/${commentId}`);

    return response.data;
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
