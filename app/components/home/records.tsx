export interface CompletionKeyword
  extends Readonly<{
      keyword: string;
      type: string;
    }> {}

export interface HomeState
  extends Readonly<{
      isKeywordCompletionOpen: boolean;
      isLoadingKeywordCompletion: boolean;
      completionKeywordList: CompletionKeyword[];
    }> {}

export const HOME_INITIAL_STATE: HomeState = {
  isKeywordCompletionOpen: true,
  isLoadingKeywordCompletion: false,
  completionKeywordList: [],
};
