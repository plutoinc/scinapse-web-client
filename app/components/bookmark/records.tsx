import { TypedRecord, recordify } from "typed-immutable-record";
import { AvailableCitationType } from "../paperShow/records";
import { SearchItemMeta, SearchItemMetaList, SearchItemMetaFactory } from "../articleSearch/records";

export interface BookmarkPageState {
  isEnd: boolean;
  hasError: boolean;
  totalPageCount: number;
  currentPage: number;
  isLoading: boolean;
  isCitationDialogOpen: boolean;
  activeCitationTab: AvailableCitationType;
  isFetchingCitationInformation: boolean;
  citationText: string;
  activeCitationDialogPaperId: number | null;
  bookmarkItemMetaList: SearchItemMeta[];
}

export interface BookmarkPageStatePart {
  isEnd: boolean;
  hasError: boolean;
  totalPageCount: number;
  currentPage: number;
  isLoading: boolean;
  isCitationDialogOpen: boolean;
  activeCitationTab: AvailableCitationType;
  isFetchingCitationInformation: boolean;
  citationText: string;
  activeCitationDialogPaperId: number | null;
  bookmarkItemMetaList: SearchItemMetaList;
}

export interface BookmarkPageStateRecord extends TypedRecord<BookmarkPageStateRecord>, BookmarkPageStatePart {}

export const initialBookmarkPageState: BookmarkPageState = {
  isEnd: false,
  hasError: false,
  totalPageCount: 0,
  currentPage: 0,
  isLoading: false,
  isCitationDialogOpen: false,
  activeCitationTab: AvailableCitationType.BIBTEX,
  isFetchingCitationInformation: false,
  citationText: "",
  activeCitationDialogPaperId: null,
  bookmarkItemMetaList: [],
};

export const BookmarkPageStateFactory = (rawBookmarkPageState = initialBookmarkPageState): BookmarkPageStateRecord => {
  return recordify({
    isEnd: false,
    hasError: false,
    totalPageCount: 0,
    currentPage: 0,
    isLoading: false,
    isCitationDialogOpen: false,
    activeCitationTab: AvailableCitationType.BIBTEX,
    isFetchingCitationInformation: false,
    citationText: "",
    activeCitationDialogPaperId: null,
    bookmarkItemMetaList: SearchItemMetaFactory(rawBookmarkPageState.bookmarkItemMetaList),
  });
};

export const INITIAL_BOOKMARK_PAGE_STATE = BookmarkPageStateFactory();
