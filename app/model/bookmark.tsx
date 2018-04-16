import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { Paper, PaperFactory, PaperRecord } from "./paper";

export interface RawBookmarkData {
  bookmarked: boolean;
  created_at: string; // Date String
  paper: Paper | null;
  paper_id: number | null;
}

export interface BookmarkDataPart {
  bookmarked: boolean;
  createdAt: string; // Date String
  paper: PaperRecord;
  paperId: number;
}

export interface BookmarkDataRecord extends TypedRecord<BookmarkDataRecord>, BookmarkDataPart {}

export interface BookmarkDataList extends List<BookmarkDataRecord> {}

export function BookmarkDataListFactory(bookmarkDataArray: RawBookmarkData[] = []): BookmarkDataList {
  if (!bookmarkDataArray) {
    return List();
  }
  const recordifiedBookmarkDataArray: BookmarkDataRecord[] = bookmarkDataArray.map(bookmarkData => {
    return recordify({
      bookmarked: bookmarkData.bookmarked,
      createdAt: bookmarkData.created_at,
      paperId: bookmarkData.paper_id,
      paper: PaperFactory(bookmarkData.paper),
    });
  });

  return List(recordifiedBookmarkDataArray);
}

export interface Bookmark {
  totalBookmarkCount: number;
  bookmarkData: RawBookmarkData[] | null;
}

export const rawBookmarkInitialState: Bookmark = {
  totalBookmarkCount: 0,
  bookmarkData: null,
};

interface BookmarkPart {
  totalBookmarkCount: 0;
  bookmarkData: BookmarkDataList;
}

export interface BookmarkRecord extends TypedRecord<BookmarkRecord>, BookmarkPart {}

export const BookmarkFactory = (rawBookmarkState = rawBookmarkInitialState): BookmarkRecord => {
  return recordify({
    totalBookmarkCount: rawBookmarkState.totalBookmarkCount,
    bookmarkData: BookmarkDataListFactory(rawBookmarkState.bookmarkData),
  });
};

export const initialBookmarkState: BookmarkRecord = BookmarkFactory();
