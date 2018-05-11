import { TypedRecord, recordify } from "typed-immutable-record";
import { AvailableCitationType } from "../paperShow/records";

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
}

export interface BookmarkPageStateRecord extends TypedRecord<BookmarkPageStateRecord>, BookmarkPageStatePart {}

export const initialBookmarkPageState: BookmarkPageState = {
  isEnd: false,
  hasError: false,
  totalPageCount: 0,
  currentPage: 1,
  isLoading: false,
  isCitationDialogOpen: false,
  activeCitationTab: AvailableCitationType.BIBTEX,
  isFetchingCitationInformation: false,
  citationText: "",
  activeCitationDialogPaperId: null,
};

export const BookmarkPageStateFactory = (rawBookmarkPageState = initialBookmarkPageState): BookmarkPageStateRecord => {
  return recordify({
    isEnd: rawBookmarkPageState.isEnd,
    hasError: rawBookmarkPageState.hasError,
    totalPageCount: rawBookmarkPageState.totalPageCount,
    currentPage: rawBookmarkPageState.currentPage,
    isLoading: rawBookmarkPageState.isLoading,
    isCitationDialogOpen: rawBookmarkPageState.isCitationDialogOpen,
    activeCitationTab: rawBookmarkPageState.activeCitationTab,
    isFetchingCitationInformation: rawBookmarkPageState.isFetchingCitationInformation,
    citationText: rawBookmarkPageState.citationText,
    activeCitationDialogPaperId: rawBookmarkPageState.activeCitationDialogPaperId,
  });
};

export const INITIAL_BOOKMARK_PAGE_STATE = BookmarkPageStateFactory();
