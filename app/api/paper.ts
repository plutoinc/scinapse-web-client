import { List } from "immutable";
import { AxiosResponse, CancelTokenSource } from "axios";
import PlutoAxios from "./pluto";
import { IPaperRecord, IPaper, recordifyPaper } from "../model/paper";
import { recordifyComment, ICommentRecord, IComment } from "../model/comment";
import {
  IGetPapersParams,
  IGetPapersResult,
  IGetCitedPapersParams,
  IGetCommentsParams,
  IGetCommentsResult,
  IPostCommentParams,
  IDeleteCommentParams,
  IDeleteCommentResult,
  IPaginationResponse,
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
    const articlesData: IPaginationResponse = articlesResponse.data;
    const rawPapers: IPaper[] = articlesData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
      first: articlesData.first,
      last: articlesData.last,
      number: articlesData.number,
      numberOfElements: articlesData.numberOfElements,
      size: articlesData.size,
      sort: articlesData.sort,
      totalElements: articlesData.totalElements,
      totalPages: articlesData.totalPages,
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
    const articlesData: IPaginationResponse = articlesResponse.data;
    const rawPapers: IPaper[] = articlesData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
      first: articlesData.first,
      last: articlesData.last,
      number: articlesData.number,
      numberOfElements: articlesData.numberOfElements,
      size: articlesData.size,
      sort: articlesData.sort,
      totalElements: articlesData.totalElements,
      totalPages: articlesData.totalPages,
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
    const articlesData: IPaginationResponse = articlesResponse.data;
    const rawPapers: IPaper[] = articlesData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
      first: articlesData.first,
      last: articlesData.last,
      number: articlesData.number,
      numberOfElements: articlesData.numberOfElements,
      size: articlesData.size,
      sort: articlesData.sort,
      totalElements: articlesData.totalElements,
      totalPages: articlesData.totalPages,
    };
  }

  public async getPaper(paperId: number, cancelTokenSource: CancelTokenSource): Promise<IPaperRecord> {
    const rawPaper = await this.get(`papers/${paperId}`, {
      cancelToken: cancelTokenSource.token,
    });

    return recordifyPaper(rawPaper.data);
  }

  public async getComments({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetCommentsParams): Promise<IGetCommentsResult> {
    const commentsResponse: AxiosResponse = await this.get(`papers/${paperId}/comments`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });
    const commentsData: IPaginationResponse = commentsResponse.data;
    const rawComments: IComment[] = commentsData.content;

    const recordifiedCommentsArray = rawComments.map((comment): ICommentRecord => {
      return recordifyComment(comment);
    });

    return {
      comments: List(recordifiedCommentsArray),
      first: commentsData.first,
      last: commentsData.last,
      number: commentsData.number,
      numberOfElements: commentsData.numberOfElements,
      size: commentsData.size,
      sort: commentsData.sort,
      totalElements: commentsData.totalElements,
      totalPages: commentsData.totalPages,
    };
  }

  public async postComment({ paperId, comment }: IPostCommentParams): Promise<ICommentRecord> {
    const commentResponse = await this.post(`papers/${paperId}/comments`, {
      comment: comment,
    });

    const commentData = commentResponse.data;
    const recordifiedComment = recordifyComment(commentData);
    return recordifiedComment;
  }

  public async deleteComment({ paperId, commentId }: IDeleteCommentParams): Promise<IDeleteCommentResult> {
    const response = await this.delete(`/papers/${paperId}/comments/${commentId}`);

    return response.data;
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
