import { List } from "immutable";
import { TypedRecord, recordify } from "typed-immutable-record";
import { Paper, PaperList, PaperFactory } from "./paper";

export interface Bookmark {
  totalBookmarkCount: number;
  bookmarkPapers: Paper[];
}

export const rawBookmarkInitialState: Bookmark = {
  totalBookmarkCount: 0,
  bookmarkPapers: null,
};

interface BookmarkPart {
  totalBookmarkCount: 0;
  bookmarkPapers: PaperList;
}

export interface BookmarkRecord extends TypedRecord<BookmarkRecord>, BookmarkPart {}

export const BookmarkPaperListFactory = (papers: Paper[] = []): PaperList => {
  const recordifiedPapersArray = papers.map(paper => {
    return PaperFactory(paper);
  });

  return List(recordifiedPapersArray);
};

export const BookmarkFactory = (rawBookmarkState = rawBookmarkInitialState): BookmarkRecord => {
  let paperList: PaperList = List();
  if (rawBookmarkState.bookmarkPapers) {
    paperList = BookmarkPaperListFactory(rawBookmarkState.bookmarkPapers);
  }

  return recordify({
    totalBookmarkCount: rawBookmarkState.totalBookmarkCount,
    bookmarkPapers: paperList,
  });
};

export const initialBookmarkState: BookmarkRecord = BookmarkFactory();
