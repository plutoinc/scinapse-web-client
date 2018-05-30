import { CompletionKeyword } from "../home/records";

export interface LayoutState
  extends Readonly<{
      isMobile: boolean;
      isBookmarkLoading: boolean;
      hasErrorOnFetchingBookmark: boolean;
      isKeywordCompletionOpen: boolean;
      isLoadingKeywordCompletion: boolean;
      completionKeywordList: CompletionKeyword[];
    }> {}

export const LAYOUT_INITIAL_STATE: LayoutState = {
  isMobile: false,
  isBookmarkLoading: false,
  hasErrorOnFetchingBookmark: false,
  isKeywordCompletionOpen: false,
  isLoadingKeywordCompletion: false,
  completionKeywordList: [],
};
