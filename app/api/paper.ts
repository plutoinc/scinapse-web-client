import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IPaperRecord, IPaper, recordifyPaper } from "../model/paper";
import { recordifyComment, ICommentRecord, IComment } from "../model/comment";
import {
  IGetPapersParams,
  IGetPapersResult,
  IGetCitedPapersParams,
  IGetPaperCommentsParams,
  IGetPaperCommentsResult,
  IPostPaperCommentParams,
  IDeletePaperCommentParams,
  IDeletePaperCommentResult,
} from "./types/paper";

class PaperAPI extends PlutoAxios {
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
    const rawPaperComments: IComment[] = articlesResponse.data.content;

    const recordifiedPaperCommentsArray = rawPaperComments.map((comment): ICommentRecord => {
      return recordifyComment(comment);
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

  public async postPaperComment({ paperId, comment }: IPostPaperCommentParams): Promise<ICommentRecord> {
    const commentResponse = await this.post(`papers/${paperId}/comments`, {
      comment: comment,
    });

    const commentData = commentResponse.data;
    const recordifiedComment = recordifyComment(commentData);
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

const apiHelper = new PaperAPI();

export default apiHelper;
