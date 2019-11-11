import { CancelToken } from 'axios';
import { PageObjectV2 } from '../types/common';
import { Paper } from '../../model/paper';
import { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';

export interface GetAuthorPapersParams {
  authorId: number;
  page: number;
  sort: AUTHOR_PAPER_LIST_SORT_TYPES;
  cancelToken: CancelToken;
  query?: string;
  size?: number;
}

export interface AuthorPapersResponse {
  content: Paper[];
  page: PageObjectV2;
}

export interface GetAuthorPaperResult extends PageObjectV2 {
  entities: { papers: { [paperId: string]: Paper } };
  result: string[];
}
