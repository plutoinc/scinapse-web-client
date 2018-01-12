import { CancelTokenSource } from "axios";
import { List } from "immutable";
import { IPaperRecord } from "../../model/paper";
import { ICommentRecord } from "../../model/comment";

export interface IGetPapersParams {
  size?: number;
  page: number;
  query: string;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetCitedPapersParams {
  size?: number;
  paperId: number;
  page: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetPapersResult {
  papers: List<IPaperRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}

export interface IGetCommentsParams {
  size?: number;
  page: number;
  paperId: number;
  cancelTokenSource: CancelTokenSource;
}

export interface IGetCommentsResult {
  comments: List<ICommentRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}

export interface IPostCommentParams {
  paperId: number;
  comment: string;
}

export interface IDeleteCommentParams {
  paperId: number;
  commentId: number;
}

export interface IDeleteCommentResult {
  success: boolean;
}

/* ***
******* PAGINATION RESPONSE FIELD INFORMATION *********
- content : array - Data of query
- size : int - The number of the page
- number : int - Current page number
- sort : object - Sorting information
- first : bool - True if the response page is the first page
- last : bool - True if the response page is the last page
- numberOfElements : int - The number of data of the current response page
- totalPages : int - The number of the total page.
- totalElements : int - The number of the total element.
*** */
export interface IPaginationResponse {
  content: any[];
  size: number;
  sort: {};
  first: boolean;
  last: boolean;
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
}
