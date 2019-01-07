import { CompletionKeyword } from "../../api/completion";

export interface HomeState
  extends Readonly<{
      completionKeywordList: CompletionKeyword[];
    }> {}

export const HOME_INITIAL_STATE: HomeState = {
  completionKeywordList: [],
};
