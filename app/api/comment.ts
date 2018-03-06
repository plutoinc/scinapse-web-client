import PlutoAxios from "./pluto";
import {
  GetCommentsParams,
  GetCommentsResult,
  PostCommentParams,
  IDeleteCommentParams,
  IDeleteCommentResult,
} from "./types/comment";
import { AxiosResponse } from "axios";
import { IComment, ICommentRecord, recordifyComment, recordifyComments } from "../model/comment";
import { IPaginationResponse } from "./types/common";

class CommentAPI extends PlutoAxios {
  public async getComments({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
    cognitive,
  }: GetCommentsParams): Promise<GetCommentsResult> {
    const getCommentsResponse: AxiosResponse = await this.get("comments", {
      params: {
        paperId,
        size,
        page,
        cognitive,
      },
      cancelToken: cancelTokenSource.token,
    });
    const getCommentsData: IPaginationResponse = getCommentsResponse.data;
    const rawComments: IComment[] = getCommentsData.content;

    return {
      comments: recordifyComments(rawComments),
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

  public async postComment({ paperId, comment, cognitivePaperId }: PostCommentParams): Promise<ICommentRecord> {
    const postCommentResponse = await this.post("comments", {
      paperId,
      comment,
      cognitivePaperId,
    });

    const postCommentData = postCommentResponse.data;
    const recordifiedComment = recordifyComment(postCommentData);
    return recordifiedComment;
  }

  public async deleteComment({ paperId, commentId }: IDeleteCommentParams): Promise<IDeleteCommentResult> {
    const deleteCommentResponse = await this.delete(`comments/${commentId}`, {
      params: {
        paperId,
      },
    });

    return deleteCommentResponse.data;
  }
}

const apiHelper = new CommentAPI();

export default apiHelper;
