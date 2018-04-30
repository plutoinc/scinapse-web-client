import { TypedRecord, recordify } from "typed-immutable-record";
import { CompletionKeywordList, CompletionKeyword, CompletionKeywordKListFactory } from "../../model/completion";

export interface LayoutState {
  isTop: boolean;
  isMobile: boolean;
  isUserDropdownOpen: boolean;
  userDropdownAnchorElement: React.ReactInstance | null;
  isBookmarkLoading: boolean;
  hasErrorOnFetchingBookmark: boolean;
  isKeywordCompletionOpen: boolean;
  isLoadingKeywordCompletion: boolean;
  completionKeywordList: CompletionKeyword[];
}

export interface LayoutStatePart {
  isTop: boolean;
  isMobile: boolean;
  isUserDropdownOpen: boolean;
  userDropdownAnchorElement: React.ReactInstance | null;
  isBookmarkLoading: boolean;
  hasErrorOnFetchingBookmark: boolean;
  isKeywordCompletionOpen: boolean;
  isLoadingKeywordCompletion: boolean;
  completionKeywordList: CompletionKeywordList;
}

export interface LayoutStateRecord extends TypedRecord<LayoutStateRecord>, LayoutStatePart {}

export const initialLayoutState: LayoutState = {
  isTop: true,
  isMobile: false,
  isUserDropdownOpen: false,
  userDropdownAnchorElement: null,
  isBookmarkLoading: false,
  hasErrorOnFetchingBookmark: false,
  isKeywordCompletionOpen: false,
  isLoadingKeywordCompletion: false,
  completionKeywordList: [],
};

export const LayoutStateFactory = (rawLayoutState: LayoutState = initialLayoutState): LayoutStateRecord => {
  return recordify({
    isTop: rawLayoutState.isTop,
    isMobile: rawLayoutState.isMobile,
    isUserDropdownOpen: rawLayoutState.isUserDropdownOpen,
    userDropdownAnchorElement: rawLayoutState.userDropdownAnchorElement,
    isBookmarkLoading: rawLayoutState.isBookmarkLoading,
    hasErrorOnFetchingBookmark: rawLayoutState.hasErrorOnFetchingBookmark,
    isKeywordCompletionOpen: rawLayoutState.isKeywordCompletionOpen,
    isLoadingKeywordCompletion: rawLayoutState.isLoadingKeywordCompletion,
    completionKeywordList: CompletionKeywordKListFactory(rawLayoutState.completionKeywordList),
  });
};

export const LAYOUT_INITIAL_STATE = LayoutStateFactory();
