import { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';

export interface PaperShowMatchParams {
  paperId: string;
}

export interface PaperShowPageQueryParams {
  'ref-page'?: number;
  'ref-sort'?: AUTHOR_PAPER_LIST_SORT_TYPES;
  'ref-query'?: string;
  'cited-page'?: number;
  'cited-sort'?: AUTHOR_PAPER_LIST_SORT_TYPES;
  'cited-query'?: string;
}

export type RefCitedTabItem = 'fullText' | 'ref' | 'cited';
