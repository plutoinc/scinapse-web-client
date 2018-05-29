import { Paper } from "./paper";

export interface RawBookmarkData {
  bookmarked: boolean;
  created_at: string; // Date String
  paper: Paper;
  paper_id: number;
}

export interface BookmarkData {
  bookmarked: boolean;
  createdAt: string; // Date String
  paper: Paper;
  paperId: number;
}

export interface Bookmark {
  totalBookmarkCount: number;
  bookmarkData: BookmarkData[];
}

export const initialBookmarkState: Bookmark = {
  totalBookmarkCount: 0,
  bookmarkData: [],
};
