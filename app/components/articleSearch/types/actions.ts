export interface FetchSearchItemsParams {
  query?: string;
  filter?: string;
  paperId?: string;
  cognitiveId?: number | null;
  page: number;
}
