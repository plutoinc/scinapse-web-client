import { TypedRecord, recordify } from "typed-immutable-record";
import { CompletionKeyword } from "../home/records";

export interface LayoutState {
  isMobile: boolean;
  isBookmarkLoading: boolean;
  hasErrorOnFetchingBookmark: boolean;
  isKeywordCompletionOpen: boolean;
  isLoadingKeywordCompletion: boolean;
  completionKeywordList: CompletionKeyword[];
}

export interface LayoutStatePart {
  isMobile: boolean;
  isBookmarkLoading: boolean;
  hasErrorOnFetchingBookmark: boolean;
  isKeywordCompletionOpen: boolean;
  isLoadingKeywordCompletion: boolean;
  completionKeywordList: CompletionKeyword[];
}

export interface LayoutStateRecord extends TypedRecord<LayoutStateRecord>, LayoutStatePart {}

export const initialLayoutState: LayoutState = {
  isMobile: false,
  isBookmarkLoading: false,
  hasErrorOnFetchingBookmark: false,
  isKeywordCompletionOpen: false,
  isLoadingKeywordCompletion: false,
  completionKeywordList: [],
};

export const LayoutStateFactory = (rawLayoutState: LayoutState = initialLayoutState): LayoutStateRecord => {
  return recordify({
    isMobile: rawLayoutState.isMobile,
    isBookmarkLoading: rawLayoutState.isBookmarkLoading,
    hasErrorOnFetchingBookmark: rawLayoutState.hasErrorOnFetchingBookmark,
    isKeywordCompletionOpen: rawLayoutState.isKeywordCompletionOpen,
    isLoadingKeywordCompletion: rawLayoutState.isLoadingKeywordCompletion,
    completionKeywordList: rawLayoutState.completionKeywordList,
  });
};

export const LAYOUT_INITIAL_STATE = LayoutStateFactory();
