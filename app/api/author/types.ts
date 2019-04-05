import { CancelToken } from "axios";
import { CommonPaginationResponsePart } from "../types/common";
import { Paper } from "../../model/paper";
import { AUTHOR_PAPER_LIST_SORT_TYPES } from "../../components/common/sortBox";

export interface GetAuthorPapersParams {
  authorId: number;
  page: number;
  sort: AUTHOR_PAPER_LIST_SORT_TYPES;
  cancelToken: CancelToken;
  query?: string;
  size?: number;
}

export interface AuthorPapersResponse extends CommonPaginationResponsePart {
  content: Paper[];
}

export interface GetAuthorPaperResult extends CommonPaginationResponsePart {
  entities: { papers: { [paperId: number]: Paper } };
  result: number[];
}
