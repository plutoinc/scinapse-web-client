import { CommonPaginationResponsePart } from "../types/common";
import { Paper } from "../../model/paper";
import { PAPER_LIST_SORT_TYPES } from "../../components/common/sortBox";

export interface GetAuthorPapersParams {
  authorId: number;
  page: number;
  sort: PAPER_LIST_SORT_TYPES;
  size?: number;
}

export interface AuthorPapersResponse extends CommonPaginationResponsePart {
  content: Paper[];
}

export interface GetAuthorPaperResult extends CommonPaginationResponsePart {
  entities: { papers: { [paperId: number]: Paper } };
  result: number[];
}
