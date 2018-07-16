import { CompletionKeyword } from "../home/records";

export interface LayoutState
  extends Readonly<{
      isMobile: boolean;
      isKeywordCompletionOpen: boolean;
      isLoadingKeywordCompletion: boolean;
      completionKeywordList: CompletionKeyword[];
    }> {}

export const LAYOUT_INITIAL_STATE: LayoutState = {
  isMobile: false,
  isKeywordCompletionOpen: false,
  isLoadingKeywordCompletion: false,
  completionKeywordList: []
};
