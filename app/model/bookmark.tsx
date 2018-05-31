import { Paper } from "./paper";

export interface RawBookmarkData
  extends Readonly<{
      bookmarked: boolean;
      created_at: string;
      paper: Paper;
      paper_id: number;
    }> {}

export interface BookmarkData
  extends Readonly<{
      bookmarked: boolean;
      createdAt: string;
      paper: Paper;
      paperId: number;
    }> {}

export interface Bookmark {
  totalBookmarkCount: number;
  bookmarkData: BookmarkData[];
}

export const INITIAL_BOOKMARK_STATE: Bookmark = {
  totalBookmarkCount: 0,
  bookmarkData: [],
};
