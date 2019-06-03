import { CancelToken } from 'axios';
import { Author } from '../../model/author/author';

export interface GetAuthorsParam {
  sort: string;
  page: number;
  query: string;
  filter?: string;
  size?: number;
  cancelToken?: CancelToken;
}

export interface GetAuthorsResult {
  authors: Author[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}
