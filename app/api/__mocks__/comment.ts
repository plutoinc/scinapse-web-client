import { List } from "immutable";
import PlutoAxios from "../pluto";
import { recordifyComment, ICommentRecord, initialComment } from "../../model/comment";
import {
  IGetCommentsParams,
  IGetCommentsResult,
  IPostCommentParams,
  IDeleteCommentParams,
  IDeleteCommentResult,
} from "../types/comment";

const mockGetCommentsResult: IGetCommentsResult = {
  comments: List(),
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 0,
  sort: null,
  totalElements: 0,
  totalPages: 0,
};

class CommentAPI extends PlutoAxios {
  public async getComments({ paperId }: IGetCommentsParams): Promise<IGetCommentsResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return mockGetCommentsResult;
    }
  }

  public async postComment({ paperId }: IPostCommentParams): Promise<ICommentRecord> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      const mockRawComment = initialComment;

      return recordifyComment(mockRawComment);
    }
  }

  public async deleteComment({ paperId }: IDeleteCommentParams): Promise<IDeleteCommentResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        success: true,
      };
    }
  }
}

const apiHelper = new CommentAPI();

export default apiHelper;
