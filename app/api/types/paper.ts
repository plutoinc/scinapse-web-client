import { CancelToken } from 'axios';
import { Paper } from '../../model/paper';
import { WeightedCitationUserGroup } from '../../constants/abTestObject';
import { PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';

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
  paperId: string;
  page: number;
  query: string;
  sort: PAPER_LIST_SORT_TYPES | null;
}

export interface GetPapersResult {
  papers: Paper[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: PAPER_LIST_SORT_TYPES | null;
  totalElements: number;
  totalPages: number;
}
