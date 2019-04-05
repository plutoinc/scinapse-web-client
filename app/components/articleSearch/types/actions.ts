export interface FetchSearchItemsParams {
  query?: string;
  filter?: string;
  paperId?: number;
  cognitiveId?: number | null;
  page: number;
}
