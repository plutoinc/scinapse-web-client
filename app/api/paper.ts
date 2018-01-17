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
    const getPapersResponse: AxiosResponse = await this.get("papers", {
      params: {
        size,
        page,
        query,
      },
      cancelToken: cancelTokenSource.token,
    });
    const getPapersData: IPaginationResponse = getPapersResponse.data;
    const rawPapers: IPaper[] = getPapersData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
      first: getPapersData.first,
      last: getPapersData.last,
      number: getPapersData.number,
      numberOfElements: getPapersData.numberOfElements,
      size: getPapersData.size,
      sort: getPapersData.sort,
      totalElements: getPapersData.totalElements,
      totalPages: getPapersData.totalPages,
    };
  }

  public async getCitedPapers({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    const getCitedPapersResponse: AxiosResponse = await this.get(`papers/${paperId}/cited`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });
    const getCitedPapersData: IPaginationResponse = getCitedPapersResponse.data;
    const rawPapers: IPaper[] = getCitedPapersData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
      first: getCitedPapersData.first,
      last: getCitedPapersData.last,
      number: getCitedPapersData.number,
      numberOfElements: getCitedPapersData.numberOfElements,
      size: getCitedPapersData.size,
      sort: getCitedPapersData.sort,
      totalElements: getCitedPapersData.totalElements,
      totalPages: getCitedPapersData.totalPages,
    };
  }

  public async getReferencePapers({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    const getReferencePapersResponse: AxiosResponse = await this.get(`papers/${paperId}/references`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });
    const getReferencePapersData: IPaginationResponse = getReferencePapersResponse.data;
    const rawPapers: IPaper[] = getReferencePapersData.content;

    const recordifiedPapersArray = rawPapers.map(paper => {
      return recordifyPaper(paper);
    });

    return {
      papers: List(recordifiedPapersArray),
      first: getReferencePapersData.first,
      last: getReferencePapersData.last,
      number: getReferencePapersData.number,
      numberOfElements: getReferencePapersData.numberOfElements,
      size: getReferencePapersData.size,
      sort: getReferencePapersData.sort,
      totalElements: getReferencePapersData.totalElements,
      totalPages: getReferencePapersData.totalPages,
    };
  }

  public async getPaper(paperId: number, cancelTokenSource: CancelTokenSource): Promise<IPaperRecord> {
    const getPaperResponse = await this.get(`papers/${paperId}`, {
      cancelToken: cancelTokenSource.token,
    });
    const rawPaper: IPaper = getPaperResponse.data;
    return recordifyPaper(rawPaper);
  }

  public async getComments({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetCommentsParams): Promise<IGetCommentsResult> {
    const getCommentsResponse: AxiosResponse = await this.get(`papers/${paperId}/comments`, {
      params: {
        size,
        page,
      },
      cancelToken: cancelTokenSource.token,
    });
    const getCommentsData: IPaginationResponse = getCommentsResponse.data;
    const rawComments: IComment[] = getCommentsData.content;

    const recordifiedCommentsArray = rawComments.map((comment): ICommentRecord => {
      return recordifyComment(comment);
    });

    return {
      comments: List(recordifiedCommentsArray),
      first: getCommentsData.first,
      last: getCommentsData.last,
      number: getCommentsData.number,
      numberOfElements: getCommentsData.numberOfElements,
      size: getCommentsData.size,
      sort: getCommentsData.sort,
      totalElements: getCommentsData.totalElements,
      totalPages: getCommentsData.totalPages,
    };
  }

  public async postComment({ paperId, comment }: IPostCommentParams): Promise<ICommentRecord> {
    const postCommentResponse = await this.post(`papers/${paperId}/comments`, {
      comment: comment,
    });

    const postCommentData = postCommentResponse.data;
    const recordifiedComment = recordifyComment(postCommentData);
    return recordifiedComment;
  }

  public async deleteComment({ paperId, commentId }: IDeleteCommentParams): Promise<IDeleteCommentResult> {
    const deleteCommentResponse = await this.delete(`/papers/${paperId}/comments/${commentId}`);

    return deleteCommentResponse.data;
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
