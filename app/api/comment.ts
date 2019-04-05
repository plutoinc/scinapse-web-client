import { AxiosResponse } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import {
  GetCommentsParams,
  GetCommentsResult,
  PostCommentParams,
  DeleteCommentParams,
  DeleteCommentResult,
  GetRawCommentsResult,
} from "./types/comment";
import { Comment, commentSchema } from "../model/comment";

class CommentAPI extends PlutoAxios {
  public async getComments({ size = 10, page = 1, paperId }: GetCommentsParams): Promise<GetCommentsResult> {
    const getCommentsResponse: AxiosResponse = await this.get("/comments", {
      params: {
        paperId,
        size,
        page: page - 1,
      },
    });

    const normalizedData = normalize(getCommentsResponse.data.content, [commentSchema]);

    return {
      entities: normalizedData.entities,
      result: normalizedData.result,
      size: getCommentsResponse.data.size,
      number: getCommentsResponse.data.number + 1,
      sort: getCommentsResponse.data.sort,
      first: getCommentsResponse.data.first,
      last: getCommentsResponse.data.last,
      numberOfElements: getCommentsResponse.data.numberOfElements,
      totalPages: getCommentsResponse.data.totalPages,
      totalElements: getCommentsResponse.data.totalElements,
    };
  }

  public async getRawComments({ size = 10, page = 1, paperId }: GetCommentsParams): Promise<GetRawCommentsResult> {
    const getCommentsResponse: AxiosResponse = await this.get("/comments", {
      params: {
        paperId,
        size,
        page: page - 1,
      },
    });

    return {
      ...getCommentsResponse.data,
      number: getCommentsResponse.data.number + 1,
    };
  }

  public async postRawComment({ paperId, comment }: PostCommentParams): Promise<Comment> {
    const postCommentResponse = await this.post("/comments", {
      paperId,
      comment,
    });

    return postCommentResponse.data;
  }

  public async postComment({
    paperId,
    comment,
    cognitivePaperId,
  }: PostCommentParams): Promise<{
    entities: { comments: { [commentId: number]: Comment } };
    result: number;
  }> {
    const postCommentResponse = await this.post("/comments", {
      paperId,
      comment,
      cognitivePaperId,
    });

    const normalizedData = normalize(postCommentResponse.data, commentSchema);

    return normalizedData;
  }

  public async deleteComment({ paperId, commentId }: DeleteCommentParams): Promise<DeleteCommentResult> {
    const deleteCommentResponse = await this.delete(`/comments/${commentId}`, {
      params: {
        paperId,
      },
    });

    return deleteCommentResponse.data;
  }
}

const apiHelper = new CommentAPI();

export default apiHelper;
