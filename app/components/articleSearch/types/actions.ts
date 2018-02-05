import { SEARCH_FETCH_ITEM_MODE } from "./";

export interface FetchSearchItemsParams {
  query?: string;
  paperId?: number;
  cognitiveId?: number | null;
  page: number;
  mode: SEARCH_FETCH_ITEM_MODE;
}
