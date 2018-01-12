import { List } from "immutable";
import PlutoAxios from "../pluto";
import { IPaperRecord, recordifyPaper, initialPaper } from "../../model/paper";
import { recordifyComment, ICommentRecord, initialComment } from "../../model/comment";
import {
  IGetPapersParams,
  IGetPapersResult,
  IGetCitedPapersParams,
  IGetCommentsParams,
  IGetCommentsResult,
  IPostCommentParams,
  IDeleteCommentParams,
  IDeleteCommentResult,
} from "../types/paper";

class PaperAPI extends PlutoAxios {
  public async getPapers({ query }: IGetPapersParams): Promise<IGetPapersResult> {
    if (!query) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        papers: List(),
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        size: 0,
        sort: null,
        totalElements: 0,
        totalPages: 0,
      };
    }
  }

  public async getCitedPapers({ paperId }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        papers: List(),
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        size: 0,
        sort: null,
        totalElements: 0,
        totalPages: 0,
      };
    }
  }

  public async getReferencesPapers({ paperId }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        papers: List(),
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        size: 0,
        sort: null,
        totalElements: 0,
        totalPages: 0,
      };
    }
  }

  public async getPaper(paperId: number): Promise<IPaperRecord> {
    if (!paperId) throw new Error("FAKE ERROR");
    const mockRawPaper = initialPaper;

    return recordifyPaper(mockRawPaper);
  }

  public async getComments({ paperId }: IGetCommentsParams): Promise<IGetCommentsResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return {
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

const apiHelper = new PaperAPI();

export default apiHelper;
