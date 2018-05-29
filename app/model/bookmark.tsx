import { Paper } from "./paper";

export interface RawBookmarkData {
  bookmarked: boolean;
  created_at: string; // Date String
  paper: Paper | null;
  paper_id: number | null;
}

export interface Bookmark {
  totalBookmarkCount: number;
  bookmarkData: RawBookmarkData[];
}

export const initialBookmarkState: Bookmark = {
  totalBookmarkCount: 0,
  bookmarkData: [],
};
