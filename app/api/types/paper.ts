import { CancelToken } from 'axios';
import { Paper } from '../../model/paper';
import { WeightedCitationUserGroup } from '../../constants/abTestObject';

export interface SearchPapersParams {
  sort: string;
  page: number;
  query: string;
  filter: string;
  size?: number;
  cancelToken?: CancelToken;
  detectYear?: boolean;
  wcm?: WeightedCitationUserGroup;
}

export interface GetRefOrCitedPapersParams {
  size?: number;
  paperId: number;
  page: number;
  query: string;
  sort: string | null;
  cancelToken: CancelToken;
}

export interface GetPapersResult {
  papers: Paper[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}
