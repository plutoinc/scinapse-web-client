import PlutoAxios from "./pluto";
import { List } from "immutable";
import {
  IGetCommentsParams,
  IGetCommentsResult,
  IPostCommentParams,
  IDeleteCommentParams,
  IDeleteCommentResult,
} from "./types/comment";
import { AxiosResponse } from "axios";
import { IComment, ICommentRecord, recordifyComment } from "../model/comment";
import { IPaginationResponse } from "./types/common";

class CommentAPI extends PlutoAxios {
  public async getComments({
    size = 10,
    page = 0,
    paperId,
    cancelTokenSource,
  }: IGetCommentsParams): Promise<IGetCommentsResult> {
    const getCommentsResponse: AxiosResponse = await this.get("comments", {
      params: {
        paperId,
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
    const postCommentResponse = await this.post("comments", {
      paperId,
      comment,
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
