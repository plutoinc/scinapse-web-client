import { CommonPaginationResponsePart } from "../types/common";
import { Paper } from "../../model/paper";

export type AUTHOR_PAPERS_SORT_TYPES = "MOST_CITATIONS" | "NEWEST_FIRST" | "OLDEST_FIRST";

export interface GetAuthorPapersParams {
  authorId: number;
  page: number;
  size: number;
  sort: AUTHOR_PAPERS_SORT_TYPES;
}

export interface AuthorPapersResponse extends CommonPaginationResponsePart {
  content: Paper[];
}

export interface GetAuthorPaperResult extends CommonPaginationResponsePart {
  entities: { papers: { [paperId: number]: Paper } };
  result: number[];
}
