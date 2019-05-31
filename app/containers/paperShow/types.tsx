export interface PaperShowMatchParams {
  paperId: string;
}

export interface PaperShowPageQueryParams {
  'ref-page'?: number;
  'cited-page'?: number;
}

export type RefCitedTabItem = 'fullText' | 'ref' | 'cited';
